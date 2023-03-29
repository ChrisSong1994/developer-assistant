import { Descriptions, Input } from 'antd';
import { useEffect, useState } from 'react';

import Icon from '@/components/Icon';
import styles from './index.less';

const Search = Input.Search;

const UrlParse = () => {
  const [url, setUrl] = useState<string>('');
  const [isFail, setIsFail] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handleUrlParse = () => {
    try {
      const urlObject = new URL(url);
      setResult(urlObject);
      setIsFail(false);
      console.log(urlObject.toJSON());
    } catch (err) {
      setIsFail(true);
      console.log('url 解析失败！', err);
    }
  };

  const handleUrlChange = (e: any) => {
    const value = e.target.value;
    setUrl(value);
  };

  useEffect(() => {
    handleUrlParse();
  }, [url]);

  return (
    <div className={styles['url-parse']}>
      <Search
        allowClear
        placeholder="在这里输入网址..."
        status={isFail ? 'error' : ''}
        enterButton="解析"
        size="large"
        addonBefore={<Icon type="icon-website" />}
        onChange={handleUrlChange}
        onSearch={handleUrlParse}
        onPressEnter={handleUrlParse}
      />
      <div className={styles['url-parse-result']}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="协议 portol" labelStyle={{ width: 140 }}>
            http
          </Descriptions.Item>
          <Descriptions.Item label="域名 portol" labelStyle={{ width: 140 }}>
            http
          </Descriptions.Item>
          <Descriptions.Item label="路径 " labelStyle={{ width: 140 }}>
            http
          </Descriptions.Item>
          <Descriptions.Item label="参数（query）" labelStyle={{ width: 140 }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="协议 portol" labelStyle={{ width: 140 }}>
                http
              </Descriptions.Item>
              <Descriptions.Item label="域名 portol" labelStyle={{ width: 140 }}>
                http
              </Descriptions.Item>
              <Descriptions.Item label="路径 " labelStyle={{ width: 140 }}>
                http
              </Descriptions.Item>
              <Descriptions.Item label="参数（query）" labelStyle={{ width: 140 }}>
                http
              </Descriptions.Item>
            </Descriptions>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

export default UrlParse;
