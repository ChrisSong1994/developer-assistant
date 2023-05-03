import {
  CaretDownOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  FlagOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Checkbox, Divider, Dropdown, Input, Menu, Space, Tooltip } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { regMatch } from '@/utils';
import styles from './index.less';

const TextArea = Input.TextArea;
const Search = Input.Search;

const dropDownItems: MenuProps['items'] = [
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
      <a target="_blank" href="https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.flags">
        <LinkOutlined /> 修饰符介绍
      </a>
    ),
    key: 'introduce',
  },
];

const syntaxItems = [
  {
    key: 0,
    label: '. - 除换行符以外的所有字符。',
  },
  {
    key: 1,
    label: '^ - 字符串开头。',
  },
  {
    key: 2,
    label: '$ - 字符串结尾。',
  },
  {
    key: 3,
    label: 'd,w,s - 匹配数字、字符、空格。',
  },
  {
    key: 4,
    label: '  D,W,S - 匹配非数字、非字符、非空格。',
  },
  {
    key: 5,
    label: '[abc] - 匹配 a、b 或 c 中的一个字母。',
  },
  {
    key: 6,
    label: '[a-z] - 匹配 a 到 z 中的一个字母。',
  },
  {
    key: 7,
    label: '[^abc] - 匹配除了 a、b 或 c 中的其他字母。',
  },
  {
    key: 8,
    label: ' aa|bb - 匹配 aa 或 bb。',
  },
  {
    key: 9,
    label: '? - 0 次或 1 次匹配。',
  },
  {
    key: 10,
    label: ' * - 匹配 0 次或多次。',
  },
  {
    key: 11,
    label: '{n} - 匹配 n次。',
  },
  {
    key: 12,
    label: ' {n,} - 匹配 n次以上。',
  },
  {
    key: 13,
    label: '{m,n} - 最少 m 次，最多 n 次匹配。',
  },
  {
    key: 14,
    label: '(expr) - 捕获 expr 子模式,以 \\1 使用它。',
  },
  {
    key: 15,
    label: '(?:expr) - 忽略捕获的子模式。',
  },
  {
    key: 16,
    label: '(?=expr) - 正向预查模式 expr。',
  },
  {
    key: 17,
    label: ' (?!expr) - 负向预查模式 expr。',
  },
];

const Regexp = () => {
  const [flags, setFlags] = useState<CheckboxValueType[]>(['g']);
  const [regexp, setRegexp] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<any>(null);
  const [replacer, setReplacer] = useState<string>('');
  const [matcheds, setMatcheds] = useState<any>(null); // 匹配结果
  const [replacedContent, setReplacedContent] = useState<string>('');

  const flag = useMemo(() => flags.join(''), [flags]);

  const matchedsContent = useMemo(() => {
    let result = content;
    const replacedStack = [];
    // 需要 html转义 以及 分段替换
    if (matcheds && matcheds.matcheds) {
      for (const matched of matcheds.matcheds) {
        const index = result.indexOf(matched);
        const next = index + matched.length;
        replacedStack.push(_.escape(result.slice(0, index)));
        replacedStack.push(result.slice(index, next).replace(matched, `<b>${_.escape(matched)}</b>`));
        result = result.slice(next);
      }
      replacedStack.push(_.escape(result));
      return replacedStack.join('');
    } else {
      return _.escape(result);
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
      let result = content;
      if (matcheds) {
        for (const matched of matcheds) {
          result = result.replace(matched, replacer);
        }
      }
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
          onChange={(e) => setRegexp(e.target.value)}
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
              <Menu items={dropDownItems} />
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
        <Dropdown trigger={['click']} menu={{ items: syntaxItems }}>
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
        {matchedsContent ? (
          <div
            className={styles['regexp-match-content']}
            // dangerouslySetInnerHTML={{ __html: JSON.stringify(matcheds, null, 2) }}
            dangerouslySetInnerHTML={{ __html: matchedsContent }}
          />
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
