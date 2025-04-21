/**
 * 1、json 格式化
 * 2、json 解析
 * 3、json 复制
 * 4、显示行号（样式处理）
 * 5、下载成json文件
 * 6、支持 json5
 * 7、支持转成json
 */
import { Tooltip } from 'antd';
import jsonlint from 'jsonlint-mod';
import { useEffect, useMemo, useState } from 'react';

import ActionsBarWrap from '@/components/ActionsBarWrap';
import Copy from '@/components/Copy';
import { JsonEditor } from '@/components/Editor';
import Icon from '@/components/Icon';
import { useWindowSize } from '@/hooks';
import { isEmpty } from '@/utils';
import Events from '@/utils/events';
import styles from './index.module.less';

const EDITOR_HEIGHT_PADDING = 130;
const JsonParseComponent = (props: any) => {
  const [value, setValue] = useState('');
  const [parseJson, setParseJson] = useState({});
  const [parseError, setParseError] = useState<string | null>(null);
  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  // json 格式化
  const handleJsonFormat = () => {
    if (isEmpty(parseError)) {
      setValue(JSON.stringify(parseJson, null, 2));
    }
  };

  const handleCompress = () => {
    if (isEmpty(parseError)) {
      setValue(JSON.stringify(parseJson));
    }
  };

  // 清除
  const handleClear = () => {
    setValue('');
  };

  // 保存
  const handleSave = () => {
    Events.saveFileToLocal({ fileName: 'Untitled.json', payload: value });
  };

  // 导入文件
  const handleImport = async () => {
    const { fileValue } = await Events.getFileFromLocalPath({
      filters: [{ name: 'json文件', extensions: ['*.json'] }],
    });
    if (fileValue) setValue(fileValue);
  };

  // json 解析
  const handleJsonParse = (value: string) => {
    if (!isEmpty(value)) {
      try {
        const data = jsonlint.parse(value);
        setParseJson(data);
        setParseError(null);
      } catch (err: any) {
        setParseError(err.message);
      }
    } else {
      setParseError(null);
    }
  };

  useEffect(() => {
    handleJsonParse(value);
  }, [value]);

  return (
    <div className={styles['json-parse']}>
      <div className={styles['json-panel']}>
        <ActionsBarWrap>
          <Copy value={value} size={18} />
          <Tooltip placement="bottom" title="美化">
            <Icon type="icon-qingchu" size={18} onClick={handleJsonFormat} />
          </Tooltip>
          <Tooltip placement="bottom" title="压缩">
            <Icon type="icon-wenjianyasuo" size={18} onClick={handleCompress} />
          </Tooltip>
          <Tooltip placement="bottom" title="保存">
            <Icon type="icon-baocun" size={18} onClick={handleSave} />
          </Tooltip>
          <Tooltip placement="bottom" title="导入">
            <Icon type="icon-daoru" size={18} onClick={handleImport} />
          </Tooltip>
          <Tooltip placement="bottom" title="清除">
            <Icon type="icon-shanchu" size={18} onClick={handleClear} />
          </Tooltip>
        </ActionsBarWrap>

        <JsonEditor
          error={parseError}
          onErrorClose={() => setParseError(null)}
          style={{ height: editorHeight }}
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  );
};

export default JsonParseComponent;
