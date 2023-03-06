import { css, cx } from '@emotion/css';
import { useEffect, useRef, useState } from 'react';

import Copy from '@/components/Copy';

import styles from './index.less';

let idCounter = 1;

interface IProps {
  label: string;
  labelPosition?: 'left' | 'center' | 'right';
  value: any;
  onChange: (val: any, e: any) => void;
}

const EditableInput = (porps: IProps) => {
  const { value, label, labelPosition = 'center', onChange } = porps;
  const inputRef = useRef(null);
  const [blurValue, setBlurValue] = useState<any>(String(value).toUpperCase());
  const [currentValue, setCurrentValue] = useState(String(value).toUpperCase());
  const inputId = `rc-editable-input-${idCounter++}`;

  const handleKeyDown = () => {};

  const setUpdatedValue = (val: any, e: any) => {
    onChange({ [label.toLowerCase()]: val }, e);
    setCurrentValue(val);
  };

  const handleChange = (e: any) => {
    setUpdatedValue(e.target.value, e);
  };

  const handleBlur = () => {
    if (blurValue) {
      setBlurValue(null);
      setCurrentValue(blurValue);
    }
  };

  useEffect(() => {
    if (inputRef.current === document.activeElement) {
      setBlurValue(String(value).toUpperCase());
    } else {
      !blurValue && setBlurValue(String(value).toUpperCase());
      setCurrentValue(String(value).toUpperCase());
    }
  }, [value]);

  return (
    <div className={styles['wrap']}>
      <input
        className={styles['input']}
        ref={inputRef}
        id={inputId}
        value={currentValue}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {label ? (
        <label className={cx(styles['label'], styles[`label-${labelPosition}`])} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <Copy className={css(`position:absolute;right:10px;top:10px;`)} value={currentValue} />
    </div>
  );
};

export default EditableInput;
