import Icon from '@/renderer/components/Icon';
import { Button } from 'antd';
import { isEmpty } from '@fett/utils';
import Events from '@/renderer/utils/events';
import { memo, useMemo } from 'react';
import BaseEditor from './BaseEditor';
import { EEditorLanguage } from './index';
import styles from './index.module.less';
interface IProps {
  value: string;
  onChange: (v: any) => void;
  style?: Record<string, any>;
  error?: string | null;
  onRepair: () => void;
  onErrorClose?: () => void;
}

const JsonEditor = (props: IProps) => {
  const { value, onChange, style, error, onErrorClose } = props;
  const errorShow = useMemo(() => !isEmpty(error), [error]);

  const handleImport = async () => {
    const { fileValue } = await Events.getFileFromLocalPath({
      filters: [{ name: 'json文件', extensions: ['*.json'] }],
    });
    return fileValue;
  };

  return (
    <div style={{ position: 'relative' }}>
      <BaseEditor
        style={style}
        language={EEditorLanguage.JSON}
        value={value}
        tipShow={true}
        onImport={handleImport}
        onChange={onChange}
      />
      {errorShow ? (
        <div className={styles['error-panel']}>
          <div className={styles['text']}> {error}</div>
          <Button size="small" onClick={props.onRepair}>
            修复
          </Button>
          <Icon className={styles['close']} type="icon-close" onClick={onErrorClose} />
        </div>
      ) : null}
    </div>
  );
};

export default memo(JsonEditor);
