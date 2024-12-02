import { Input, message, Tooltip } from 'antd';
import type { TextAreaProps } from 'antd/lib/input';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Icon from '@/components/Icon';
import styles from './index.module.less';

const TextArea = Input.TextArea;

interface IProps extends TextAreaProps {
  label?: string;
  description?: string;
}

const CustomTextArea = (props: IProps) => {
  const { label, description, ...originProps } = props;

  return (
    <div className={styles['custom-textarea']}>
      <div className={styles['custom-textarea-header']}>
        <div className={styles['custom-textarea-label']}>{`${label}：`}</div>
        <div className={styles['custom-textarea-actions']}>
          <Tooltip title="复制" color={'#fff'} overlayInnerStyle={{ color: '#000' }}>
            <CopyToClipboard text={originProps.value} onCopy={() => message.success(`已复制${label}到剪贴板`)}>
              <span>
                <Icon type="icon-fuzhi" />
              </span>
            </CopyToClipboard>
          </Tooltip>
          <Tooltip title="打开文件地址" color={'#fff'} overlayInnerStyle={{ color: '#000' }}>
            <span>
              <Icon type="icon-wenjianjia" />
            </span>
          </Tooltip>
        </div>
      </div>
      {description ? <div className={styles['custom-textarea-description']}>{description}</div> : null}
      <TextArea spellCheck={false} {...originProps} autoSize={{ minRows: 8, maxRows: 12 }} />
    </div>
  );
};

export default CustomTextArea;
