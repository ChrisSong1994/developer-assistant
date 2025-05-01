import { Button, Input, Select, Space, Tooltip } from 'antd';
import { Fragment, useState } from 'react';
// @ts-ignore
import Base64 from 'Base64';

import ActionsBarWrap from '@/renderer/components/ActionsBarWrap';
import Copy from '@/renderer/components/Copy';
import Icon from '@/renderer/components/Icon';
import ImageUpload from '@/renderer/components/ImageUpload';
import { BASE64_INPUT_CONTENT_TYPE_OPTIONS } from '@/renderer/constants';
import Events from '@/renderer/utils/events';

const TextArea = Input.TextArea;

enum EContentType {
  PLAINTEXT = 'plaintext',
  IMAGE = 'image',
}

const Base64CodingComponent = () => {
  const [decodeValue, setDecodeValue] = useState<string>('');
  const [encodeValue, setEncodeValue] = useState<string>('');
  const [contentType, setContentType] = useState<EContentType>(EContentType.PLAINTEXT);

  const handleEncode = () => {
    const res = Base64.btoa(decodeValue);
    setEncodeValue(res);
  };

  const handleDecode = () => {
    const res = Base64.atob(encodeValue);
    setDecodeValue(res);
  };

  const handleSave = (value: string) => {
    Events.saveFileToLocal({ fileName: 'Untitled.text', payload: value });
  };

  return (
    <Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ height: 32 }}>
          <span style={{ fontWeight: 500, fontSize: 14 }}>内容：</span>
          <Select
            style={{ width: 140, padding: '2px 0' }}
            size="small"
            value={contentType}
            onSelect={setContentType}
            options={BASE64_INPUT_CONTENT_TYPE_OPTIONS}
          />
        </div>
        {contentType === EContentType.PLAINTEXT ? (
          <ActionsBarWrap palcement="right">
            <Copy value={decodeValue} size={18} />
            <Tooltip placement="bottom" title="保存">
              <Icon type="icon-save" size={18} onClick={() => handleSave(decodeValue)} />
            </Tooltip>
            <Tooltip placement="bottom" title="清除">
              <Icon type="icon-delete" size={18} onClick={() => setDecodeValue('')} />
            </Tooltip>
          </ActionsBarWrap>
        ) : null}
      </div>

      {contentType === EContentType.IMAGE ? (
        <ImageUpload imageStyle={{ height: 300 }} style={{ marginBottom: 8 }} onChange={setEncodeValue} value={encodeValue} />
      ) : null}
      {contentType === EContentType.PLAINTEXT ? (
        <TextArea
          spellCheck={false}
          rows={14}
          placeholder="请输入待编码内容"
          value={decodeValue}
          onChange={(e) => setDecodeValue(e.target.value)}
        />
      ) : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        {contentType === EContentType.PLAINTEXT ? (
          <Space style={{ margin: '12px 0' }}>
            <Button type="primary" onClick={handleEncode}>
              编码
            </Button>
            <Button type="primary" onClick={handleDecode}>
              解码
            </Button>
          </Space>
        ) : (
          <span />
        )}
        <ActionsBarWrap palcement="right">
          <Copy value={encodeValue} size={18} />
          <Tooltip placement="bottom" title="保存">
            <Icon type="icon-save" size={18} onClick={() => handleSave(encodeValue)} />
          </Tooltip>
          <Tooltip placement="bottom" title="清除">
            <Icon type="icon-delete" size={18} onClick={() => setEncodeValue('')} />
          </Tooltip>
        </ActionsBarWrap>
      </div>

      <TextArea
        spellCheck={false}
        rows={14}
        placeholder="请输入待解码内容"
        value={encodeValue}
        onChange={(e) => setEncodeValue(e.target.value)}
      />
    </Fragment>
  );
};

export default Base64CodingComponent;
