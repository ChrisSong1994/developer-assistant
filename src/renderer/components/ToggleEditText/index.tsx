import type { InputRef } from 'antd';
import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface IProps {
  value: string;
  onChange: (v: string) => void;
}

const ToggleEditText = (props: IProps) => {
  const { value, onChange } = props;
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
    <div>
      {editing ? (
        <Input defaultValue={value} ref={inputRef} bordered={false} onBlur={handleBlur} />
      ) : (
        <div onClick={handleEdit}>{value}</div>
      )}
    </div>
  );
};

export default ToggleEditText;
