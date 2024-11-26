import type { InputRef } from 'antd';
import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { isEmpty } from '@/utils';
import styles from './index.module.less';
interface IProps {
  value: string;
  defaultValue?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style: Record<string, any>;
}

const ToggleEditText = (props: IProps) => {
  const { value, onChange, style, placeholder = '', defaultValue = '未命名' } = props;
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const handleBlur = (e: any) => {
    const value = e.target.value.trim();
    if (isEmpty(value)) {
      onChange(defaultValue);
    } else {
      onChange(value);
    }

    setEditing(false);
  };
  const handleEdit = () => {
    setEditing(true);
  };

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  return (
    <div style={{ ...style, width: '100%' }}>
      {editing ? (
        <Input
          style={{ height: '100%', width: '100%', padding: '2px 0px', textAlign: 'center' }}
          placeholder={placeholder}
          defaultValue={value}
          ref={inputRef}
          bordered={false}
          onBlur={handleBlur}
          onPressEnter={handleBlur}
        />
      ) : (
        <div className={styles['text']} style={{ height: '100%', width: '100%' }} onClick={handleEdit}>
          {value}
        </div>
      )}
    </div>
  );
};

export default ToggleEditText;
