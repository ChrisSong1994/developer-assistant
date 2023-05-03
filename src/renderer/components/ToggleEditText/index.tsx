import type { InputRef } from 'antd';
import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';

import styles from './index.less';
interface IProps {
  value: string;
  onChange: (v: string) => void;
  style: Record<string, any>;
}

const ToggleEditText = (props: IProps) => {
  const { value, onChange, style } = props;
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const handleBlur = (e: any) => {
    onChange(e.target.value);
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
          style={{ height: '100%', width: '100%', padding: '2px 0px' }}
          defaultValue={value}
          ref={inputRef}
          bordered={false}
          onBlur={handleBlur}
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
