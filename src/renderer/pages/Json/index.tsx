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
import { Popover, Space, message } from 'antd';
import { useAtom } from 'jotai';

import ActionsBarWrap from '@/renderer/components/ActionsBarWrap';
import Copy from '@/renderer/components/Copy';
import { JsonEditor } from '@/renderer/components/Editor';
import Icon from '@/renderer/components/Icon';
import { useWindowSize } from '@/renderer/hooks';
import { isEmpty } from '@/renderer/utils';
import Events from '@/renderer/utils/events';
import localAtom from '@/renderer/stores/local';
import styles from './index.module.less';

const EDITOR_HEIGHT_PADDING = 100;
const JsonParseComponent = () => {
  const [value, setValue] = useState('');
  const [parseJson, setParseJson] = useState({});
  const [parseError, setParseError] = useState<string | null>(null);
  const { height } = useWindowSize();
  const [localData, setLocalData] = useAtom(localAtom);
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  const historyMenus = useMemo(() => {
    return (
      <div className={styles['json-history']}>
        {(localData?.json_history || []).map((item) => {
          return (
            <div
              className={styles['json-history-item']}
              key={item.filepath}
              onClick={() => handleImportHistoryJsonFile(item.filepath)}
            >
              <Space>
                <div className={styles['json-history-item-name']}>{item.name}</div>
                <span className={styles['json-history-item-date']}>{item.update_at}</span>
              </Space>
              <div className={styles['json-history-item-filepath']}>{item.filepath}</div>
            </div>
          );
        })}
      </div>
    );
  }, [localData]);

  const handleImportHistoryJsonFile = async (filePath: string) => {
    try {
      const fileValue = await Events.getFileFromPath({ filePath });
      setValue(fileValue);
    } catch (err: any) {
      message.error(err.message);
      // 解析失败删除历史记录
      handleDeleteJsonHistory(filePath);
    }
  };
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
  const handleSave = async () => {
    const res = await Events.saveFileToLocal({ fileName: 'Untitled.json', payload: value });
    if (res) {
      handleAddJsonHistory(res.filePath, res.fileName);
    }
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

  const handleDeleteJsonHistory = (filepath: string) => {
    const newJsonHistory = localData?.json_history.filter((item: any) => item.filepath !== filepath);
    // @ts-ignore
    setLocalData({ json_history: newJsonHistory });
  };

  const handleAddJsonHistory = (filepath: string, name: string) => {
    const newJsonHistory = [
      {
        filepath,
        name: name,
        time: Date.now(),
      },
      // @ts-ignore
      ...localData?.json_history.filter((item: any) => item.filepath !== filepath),
    ];
    // @ts-ignore
    setLocalData({ json_history: newJsonHistory });
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
            <Icon type="icon-clear" withHoverBg size={18} onClick={handleJsonFormat} />
          </Tooltip>
          <Tooltip placement="bottom" title="压缩">
            <Icon type="icon-compress" withHoverBg size={18} onClick={handleCompress} />
          </Tooltip>
          <Tooltip placement="bottom" title="保存">
            <Icon type="icon-save" withHoverBg size={18} onClick={handleSave} />
          </Tooltip>
          <Tooltip placement="bottom" title="导入">
            <Icon type="icon-export" withHoverBg size={18} onClick={handleImport} />
          </Tooltip>
          <Tooltip placement="bottom" title="清除">
            <Icon type="icon-delete" withHoverBg size={18} onClick={handleClear} />
          </Tooltip>
          {localData?.json_history?.length ? (
            <Tooltip placement="bottom" title="历史记录">
              <Popover placement="bottomLeft" title="" trigger="click" content={historyMenus}>
                <Icon type="icon-history" withHoverBg size={18} />
              </Popover>
            </Tooltip>
          ) : (
            <Tooltip placement="bottom" title="历史记录">
              <Icon type="icon-history" withHoverBg size={18} />
            </Tooltip>
          )}
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
