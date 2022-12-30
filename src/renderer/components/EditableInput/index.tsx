import { useState } from 'react';

const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;
const VALID_KEY_CODES = [UP_KEY_CODE, DOWN_KEY_CODE];

interface IProps {
  value: any;
  onChange: (val: any, e: any) => void;
}

const EditableInput = (porps: IProps) => {
  const { value, onChange } = porps;

  const [data, setData] = useState(String(value).toUpperCase());

  const handleKeyDown = () => {};

  const handleBlur = () => {};

  const setUpdatedValue = (value: any, e: any) => {
    debugger;
    console.log(value);
  };
  const handleChange = (e: any) => {
    setUpdatedValue(e.target.value, e);
  };

  return (
    <div>
      <input value={value} onKeyDown={handleKeyDown} onChange={handleChange} onBlur={handleBlur} />
    </div>
  );
};

export default EditableInput;
