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
import { Popover, message } from 'antd';
import { dayjs } from '@fett/utils';
import { jsonrepair } from 'jsonrepair';

import ActionsBarWrap from '@/renderer/components/ActionsBarWrap';
import Copy from '@/renderer/components/Copy';
import { JsonEditor } from '@/renderer/components/Editor';
import Icon from '@/renderer/components/Icon';
import { useLocalData } from '@/renderer/hooks';
import { isEmpty } from '@fett/utils';
import Events from '@/renderer/utils/events';
import styles from './index.module.less';

const EDITOR_HEIGHT_PADDING = 100;
const JsonParseComponent = () => {
  const [value, setValue] = useState('');
  const [parseJson, setParseJson] = useState({});
  const [parseError, setParseError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { data: localData, setData: setLocalData } = useLocalData();

  // 待定
  const [currentJsonFile, setCurrentJsonFile] = useState<string | null>(null);

  const historyMenus = useMemo(() => {
    return (
      <div className={styles['json-history']}>
        <div className={styles['json-history-title']}>历史记录</div>
        {(localData?.json_history || []).map((item) => {
          return (
            <div
              className={styles['json-history-item']}
              key={item.filepath}
              onClick={() => handleImportHistoryJsonFile(item.filepath)}
            >
              <div className={styles['info']}>
                <div className={styles['name']}>{item.name}</div>
                <span className={styles['date']}>{dayjs(item.time).format('YYYY-MM-DD HH:mm')}</span>
              </div>
              <div className={styles['filepath']}>{item.filepath}</div>
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
      setHistoryOpen(false);
      setCurrentJsonFile(filePath);
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
    setCurrentJsonFile(null);
  };

  // 保存
  const handleSave = async () => {
    const params = {
      defaultPath: currentJsonFile ?? undefined,
      fileName: 'Untitled.json',
      payload: value,
    };

    const res = await Events.saveFileToLocal(params);
    if (res) {
      handleAddJsonHistory(res.filePath, res.fileName);
    }
  };

  // 导入文件
  const handleImport = async () => {
    const { fileValue, filePath } = await Events.getFileFromLocalPath({
      filters: [{ name: 'json 文件', extensions: ['*.json'] }],
    });
    if (fileValue && filePath) {
      setValue(fileValue);
      setCurrentJsonFile(filePath);
    }
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

  const handleRepair = () => {
    try {
      setValue(jsonrepair(value));
    } catch (err) {
      message.error('修复失败！');
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
    ].slice(0, 20);
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
          <Tooltip placement="bottom" title="导入">
            <Icon type="icon-export" withHoverBg size={18} onClick={handleImport} />
          </Tooltip>
          <Tooltip placement="bottom" title="保存">
            <Icon type="icon-save" withHoverBg size={18} onClick={handleSave} />
          </Tooltip>
          <Tooltip placement="bottom" title="美化">
            <Icon type="icon-clear" withHoverBg size={18} onClick={handleJsonFormat} />
          </Tooltip>
          <Tooltip placement="bottom" title="压缩">
            <Icon type="icon-compress" withHoverBg size={18} onClick={handleCompress} />
          </Tooltip>
          <Tooltip placement="bottom" title="修复">
            <Icon type="icon-repair" withHoverBg size={18} onClick={handleRepair} />
          </Tooltip>

          {localData?.json_history?.length ? (
            <Tooltip placement="bottom" title="历史记录">
              <Popover
                placement="bottomLeft"
                title=""
                open={historyOpen}
                trigger="click"
                onOpenChange={setHistoryOpen}
                content={historyMenus}
              >
                <Icon type="icon-history" withHoverBg size={18} />
              </Popover>
            </Tooltip>
          ) : (
            <Tooltip placement="bottom" title="历史记录">
              <Icon type="icon-history" withHoverBg size={18} />
            </Tooltip>
          )}
          <Tooltip placement="bottom" title="清除">
            <Icon type="icon-delete" withHoverBg size={18} onClick={handleClear} />
          </Tooltip>
        </ActionsBarWrap>

        <JsonEditor
          error={parseError}
          onRepair={handleRepair}
          onErrorClose={() => setParseError(null)}
          style={{ height: `calc(100vh - ${EDITOR_HEIGHT_PADDING}px)` }}
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  );
};

export default JsonParseComponent;
