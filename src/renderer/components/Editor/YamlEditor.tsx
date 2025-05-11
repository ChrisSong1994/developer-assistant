import Icon from '@/renderer/components/Icon';
import { isEmpty } from '@/renderer/utils';
import Events from '@/renderer/utils/events';
import { memo, useMemo } from 'react';
import BaseEditor from './BaseEditor';
import { EEditorLanguage } from './index';
import styles from './index.module.less';

interface IProps {
  value: string;
  onChange: (v: any) => void;
  style?: Record<string, any>;
  error?: string;
  onErrorClose?: () => void;
}

const YamlEditor = (props: IProps) => {
  const { value, onChange, style, error, onErrorClose } = props;
  const errorShow = useMemo(() => !isEmpty(error), [error]);

  const handleImport = async () => {
    const { fileValue } = await Events.getFileFromLocalPath({
      filters: [{ name: 'yaml文件', extensions: ['*.yaml', '*.yml'] }],
    });
    return fileValue;
  };

  return (
    <div style={{ position: 'relative' }}>
      <BaseEditor
        style={style}
        language={EEditorLanguage.YAML}
        tipShow={true}
        onImport={handleImport}
        value={value}
        onChange={onChange}
      />
      {errorShow ? (
        <div className={styles['error-panel']}>
          <div className={styles['text']}> {error}</div>
          <Icon className={styles['close']} type="icon-guanbi" onClick={onErrorClose} />
        </div>
      ) : null}
    </div>
  );
};

export default memo(YamlEditor);
