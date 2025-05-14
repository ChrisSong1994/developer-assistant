import {
  CaretDownOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  FlagOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Divider, Dropdown, Input, Menu, Popover, Space, Tooltip } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useEffect, useMemo, useState } from 'react';

import { REGEXP_SYNTAX_COMMENTS_OPTIONS } from '@/renderer/constants';
import regMatch from '@/renderer/utils/regMatch';
import styles from './index.module.less';

const TextArea = Input.TextArea;
const Search = Input.Search;

const Regexp = () => {
  const [flags, setFlags] = useState<CheckboxValueType[]>(['g']);
  const [regexp, setRegexp] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<any>(null);
  const [replacer, setReplacer] = useState<string>('');
  const [matcheds, setMatcheds] = useState<any>(null); // 匹配结果
  const [replacedContent, setReplacedContent] = useState<string>('');

  const flag = useMemo(() => flags.join(''), [flags]);

  const matchedsContents = useMemo(() => {
    let result = content;
    let preEnd = 0;
    const replacedStack = [];
    // 需要 html转义 以及 分段替换
    if (matcheds && matcheds.length) {
      for (const matched of matcheds) {
        const index = matched.index;
        const next = index + matched.length;
        replacedStack.push(result.slice(preEnd, index));
        replacedStack.push(
          <Popover
            placement="top"
            title={null}
            content={
              <div className={styles['regexp-matched']}>
                <div className={styles['match-value']}>
                  {`Matched $${matched.key} [${index},${next}] : ${matched.value} `}
                </div>
                {matched.groups &&
                  matched.groups.map((group: any) => {
                    return <div>{`Group ${group.key} : ${group.value} `}</div>;
                  })}
              </div>
            }
          >
            <b>{matched.value}</b>
          </Popover>,
        );
        preEnd = next;
      }
      replacedStack.push(result.slice(preEnd));
      return replacedStack;
    } else {
      return result;
    }
  }, [matcheds, content]);

  useEffect(() => {
    if (regexp) {
      try {
        const reg = new RegExp(regexp, flag);
        setMatcheds(regMatch(reg, content));
        setError(null);
      } catch (err) {
        setMatcheds(null);
        setError(err);
      }
    } else {
      setMatcheds(null);
    }
  }, [regexp, content, flag]);

  const handleReplace = () => {
    if (!error) {
      const reg = new RegExp(regexp, flag);
      let result = content.replace(reg, replacer);
      setReplacedContent(result);
    }
  };

  return (
    <div>
      <div className={styles['regexp-header']}>
        <Input
          style={{ width: 'calc( 100% - 380px )' }}
          size="large"
          value={regexp}
          onChange={(e) => {
            setRegexp(e.target.value);
          }}
          addonBefore={
            <span style={{ fontSize: 18, padding: '0 6px', display: 'flex', alignItems: 'center' }}>
              {error ? (
                <Tooltip placement="bottomRight" title={error.message}>
                  <ExclamationCircleOutlined style={{ color: 'red', marginRight: 4 }} />
                </Tooltip>
              ) : null}
              /
            </span>
          }
          addonAfter={<span style={{ fontSize: 18, padding: '0 6px' }}>/{flag}</span>}
        />
        <Dropdown
          trigger={['click']}
          dropdownRender={() => (
            <Checkbox.Group value={flags} onChange={setFlags}>
              <Menu
                items={[
                  {
                    label: <Checkbox value="g">全局搜索 g</Checkbox>,
                    key: 'g',
                  },
                  {
                    label: <Checkbox value="i"> 忽略大小写 i</Checkbox>,
                    key: 'i',
                  },
                  {
                    label: <Checkbox value="m"> 多行模式 m</Checkbox>,
                    key: 'm',
                  },
                  {
                    label: <Divider style={{ margin: 0 }} />,
                    key: 'divider',
                  },
                  {
                    label: (
                      <a
                        target="_blank"
                        href="https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.flags"
                      >
                        <LinkOutlined /> 修饰符介绍
                      </a>
                    ),
                    key: 'introduce',
                  },
                ]}
              />
            </Checkbox.Group>
          )}
        >
          <Button style={{ width: 140, marginLeft: 20 }} type="primary" size="large">
            <Space>
              <FlagOutlined /> 修饰符
              <CaretDownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <Dropdown trigger={['click']} menu={{ items: REGEXP_SYNTAX_COMMENTS_OPTIONS }}>
          <Button style={{ width: 140, marginLeft: 16 }} type="primary" size="large">
            <Space>
              <FileSearchOutlined /> 语法参考
              <CaretDownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>
      <TextArea
        spellCheck={false}
        style={{ marginTop: 20, height: 200 }}
        placeholder="在此输入待匹配文本"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={styles['regexp-match']}>
        {matchedsContents && matchedsContents?.length ? (
          <div className={styles['regexp-match-content']}>{matchedsContents}</div>
        ) : (
          <span>匹配结果...</span>
        )}
      </div>
      <Search
        style={{ marginTop: 20 }}
        addonBefore="替换文本："
        enterButton="替换"
        placeholder="在此输入替换文本"
        size="large"
        value={replacer}
        onChange={(e) => setReplacer(e.target.value)}
        onSearch={handleReplace}
      />
      <TextArea
        spellCheck={false}
        value={replacedContent}
        style={{ marginTop: 20, height: 200 }}
        placeholder="替换结果..."
      />
    </div>
  );
};

export default Regexp;
