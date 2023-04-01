import { Descriptions, Input } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import Icon from '@/components/Icon';
import { isEmpty } from '@/utils';
import styles from './index.less';

const Search = Input.Search;
const URL_PARAMS = ['protocol', 'username', 'password', 'hostname', 'port', 'pathname', 'hash', 'searchParams'];

const urlConverToObject = (url: URL) => {
  const result: Record<string, any> = {};
  if (!url) return result;
  for (let key of URL_PARAMS) {
    // @ts-ignore
    const value = url[key];
    if (value) {
      if (key === 'searchParams') {
        const params: Record<string, any> = {};
        value.forEach((v: string, k: string) => {
          Reflect.set(params, k, v);
        });
        Reflect.set(result, key, params);
      } else {
        Reflect.set(result, key, value);
      }
    }
  }
  return result;
};

const UrlParse = () => {
  const [url, setUrl] = useState<string>('');
  const [isFail, setIsFail] = useState<boolean>(false);
  const [urlInstance, setUrlInstance] = useState<any>(null);
  const urlParseData = useMemo(() => urlConverToObject(urlInstance), [urlInstance]);

  console.log('urlParseData', urlParseData);

  const handleUrlParse = () => {
    if (!isEmpty(url)) {
      try {
        setUrlInstance(new URL(url));
        setIsFail(false);
      } catch (err) {
        setIsFail(true);
        console.log('url 解析失败！', err);
      }
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
          {Object.keys(urlParseData).map((key) => {
            const value = urlParseData[key];
            if (key === 'searchParams') {
              return (
                <Descriptions.Item key={key} label={key} labelStyle={{ width: 140 }}>
                  <Descriptions bordered column={1}>
                    {Object.keys(value).map((k) => {
                      return (
                        <Descriptions.Item key={k} label={k} labelStyle={{ width: 140 }}>
                          {value[k]}
                        </Descriptions.Item>
                      );
                    })}
                  </Descriptions>
                </Descriptions.Item>
              );
            } else {
              return (
                <Descriptions.Item key={key} label={key} labelStyle={{ width: 140 }}>
                  {value}
                </Descriptions.Item>
              );
            }
          })}
        </Descriptions>
      </div>
    </div>
  );
};

export default UrlParse;
