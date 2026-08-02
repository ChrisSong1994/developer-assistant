import { dayjs } from '@fett/utils';
import { Button, Descriptions, Input, Select, Space, Tag, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import ActionsBarWrap from '@/renderer/components/ActionsBarWrap';
import Copy from '@/renderer/components/Copy';
import { BaseEditor, EEditorLanguage } from '@/renderer/components/Editor';
import Icon from '@/renderer/components/Icon';
import { safeStringify } from '@/renderer/utils/safeStringify';
import Events from '@/renderer/utils/events';

import { EAlgGroup, EXAMPLE_TOKEN, getAlgGroup } from './constants';
import { IDecodedJwt, IVerifyResult } from './types';
import { parseJwt } from './utils/decode';
import { bytesToHex, verifySignature } from './utils/verify';

const TextArea = Input.TextArea;

const CLAIM_LABELS: Record<string, string> = {
  exp: '过期时间 (exp)',
  iat: '签发时间 (iat)',
  nbf: '生效时间 (nbf)',
};

const JwtDecode = () => {
  const [token, setToken] = useState<string>('');
  const [parsed, setParsed] = useState<IDecodedJwt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [secret, setSecret] = useState<string>('');
  const [publicKeyPem, setPublicKeyPem] = useState<string>('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<IVerifyResult | null>(null);

  // 自动解码
  useEffect(() => {
    if (!token.trim()) {
      setParsed(null);
      setError(null);
      setVerifyResult(null);
      return;
    }
    try {
      const result = parseJwt(token);
      setParsed(result);
      setError(null);
      setVerifyResult(null);
    } catch (e: any) {
      setParsed(null);
      setError(e?.message || '解析失败');
      setVerifyResult(null);
    }
  }, [token]);

  const algGroup = useMemo(() => (parsed ? getAlgGroup(parsed.alg) : EAlgGroup.NONE), [parsed]);

  const handleImport = async () => {
    const { fileValue } = await Events.getFileFromLocalPath();
    if (fileValue) setToken(fileValue.trim());
  };

  const handleVerify = async () => {
    if (!parsed) return;
    setVerifyLoading(true);
    try {
      const result = await verifySignature({
        alg: parsed.alg,
        parts: parsed.parts,
        secret: algGroup === EAlgGroup.HMAC ? secret : undefined,
        publicKeyPem: algGroup === EAlgGroup.RSA || algGroup === EAlgGroup.ECDSA ? publicKeyPem : undefined,
      });
      setVerifyResult(result);
    } finally {
      setVerifyLoading(false);
    }
  };

  const renderTimestamp = () => {
    const entries = Object.entries(parsed?.claims || {});
    if (!entries.length) return null;
    return (
      <Descriptions
        size="small"
        column={1}
        style={{ marginTop: 12 }}
        items={entries.map(([key, value]) => {
          const date = dayjs.unix(value);
          const now = dayjs();
          let status: React.ReactNode = null;
          if (key === 'exp') {
            status = now.isBefore(date) ? (
              <Tag color="success">有效期内(剩余 {date.diff(now, 'hour')}h)</Tag>
            ) : (
              <Tag color="error">已过期</Tag>
            );
          }
          return {
            key,
            label: CLAIM_LABELS[key] || key,
            children: (
              <Space>
                <span>{value}</span>
                <span style={{ color: '#888' }}>{date.format('YYYY-MM-DD HH:mm:ss')}</span>
                {status}
              </Space>
            ),
          };
        })}
      />
    );
  };

  const renderVerifyArea = () => {
    if (!parsed) return null;
    if (algGroup === EAlgGroup.UNSUPPORTED || algGroup === EAlgGroup.NONE) {
      return (
        <div style={{ margin: '12px 0' }}>
          <Tag color={algGroup === EAlgGroup.NONE ? 'default' : 'warning'}>
            {algGroup === EAlgGroup.NONE ? 'alg 为 none,无签名可校验' : `暂不支持校验 ${parsed.alg} 算法`}
          </Tag>
        </div>
      );
    }

    return (
      <div style={{ margin: '12px 0' }}>
        <Space wrap>
          <span>算法:</span>
          <Select
            value={parsed.alg}
            style={{ width: 100 }}
            disabled
            options={[{ label: parsed.alg, value: parsed.alg }]}
          />
          {algGroup === EAlgGroup.HMAC ? (
            <Input
              placeholder="输入 HMAC 密钥 (secret)"
              style={{ width: 320 }}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          ) : (
            <TextArea
              placeholder="粘贴公钥 PEM(-----BEGIN PUBLIC KEY----- ... -----END PUBLIC KEY-----)"
              style={{ width: 420 }}
              autoSize={{ minRows: 2, maxRows: 4 }}
              value={publicKeyPem}
              onChange={(e) => setPublicKeyPem(e.target.value)}
            />
          )}
          <Button type="primary" loading={verifyLoading} onClick={handleVerify}>
            校验签名
          </Button>
          {verifyResult && (
            <Tag color={verifyResult.valid ? 'success' : 'error'}>{verifyResult.valid ? '有效' : '无效'}</Tag>
          )}
        </Space>
        {verifyResult?.error && (
          <div style={{ marginTop: 8, color: '#ff4d4f', fontSize: 13 }}>{verifyResult.error}</div>
        )}
      </div>
    );
  };

  const renderTabs = () => {
    if (!parsed) return null;
    return (
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 500, fontSize: 14 }}>Header</span>
          <Copy value={safeStringify(parsed.header)} size={16} />
        </div>
        <BaseEditor
          editable={false}
          language={EEditorLanguage.JSON}
          value={safeStringify(parsed.header)}
          style={{ height: 180 }}
          onChange={() => {}}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 8px' }}>
          <span style={{ fontWeight: 500, fontSize: 14 }}>Payload</span>
          <Copy value={safeStringify(parsed.payload)} size={16} />
        </div>
        <BaseEditor
          editable={false}
          language={EEditorLanguage.JSON}
          value={safeStringify(parsed.payload)}
          style={{ height: 220 }}
          onChange={() => {}}
        />
        {renderTimestamp()}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 8px' }}>
          <span style={{ fontWeight: 500, fontSize: 14 }}>Signature</span>
          <Copy value={parsed.signature} size={16} />
        </div>
        <TextArea spellCheck={false} readOnly value={parsed.signature} style={{ height: 60 }} />
        <div style={{ marginTop: 8 }}>
          <div style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>签名原始字节 (hex):</div>
          <div
            style={{
              wordBreak: 'break-all',
              fontSize: 12,
              color: '#555',
              background: '#fafafa',
              padding: '8px 12px',
              borderRadius: 4,
            }}
          >
            {bytesToHex(parsed.signatureBytes)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ height: 32 }} />
        <ActionsBarWrap palcement="right">
          <Tooltip placement="bottom" title="示例">
            <Icon type="icon-key" withHoverBg size={18} onClick={() => setToken(EXAMPLE_TOKEN)} />
          </Tooltip>
          <Copy value={token} size={18} />
          <Tooltip placement="bottom" title="导入">
            <Icon type="icon-export" withHoverBg size={18} onClick={handleImport} />
          </Tooltip>
          <Tooltip placement="bottom" title="清除">
            <Icon type="icon-delete" withHoverBg size={18} onClick={() => setToken('')} />
          </Tooltip>
        </ActionsBarWrap>
      </div>

      <TextArea
        spellCheck={false}
        rows={6}
        placeholder="粘贴 JWT token,如 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      {error && (
        <div
          style={{
            marginTop: 12,
            padding: '8px 12px',
            background: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: 4,
            color: '#ff4d4f',
          }}
        >
          {error}
        </div>
      )}

      {renderVerifyArea()}
      {renderTabs()}
    </div>
  );
};

export default JwtDecode;
