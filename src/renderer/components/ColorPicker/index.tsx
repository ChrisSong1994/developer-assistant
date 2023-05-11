import { ChromePicker } from "react-color";
import { Popover } from "antd";

import styles from "./index.less";
interface IColorCatch {
  value: string;
  onChange: (key: string) => void;
}

const ColorPicker = (props: IColorCatch) => {
  const { value, onChange } = props;

  // 颜色选择
  const handleColorChange = (color: any) => {
    onChange(color?.hex);
  };

  return (
    <Popover
      title={null}
      placement="bottomLeft"
      trigger="click"
      overlayStyle={{ padding: 6 }}
      content={
        <ChromePicker
          className={styles["color-picker"]}
          color={value}
          onChange={handleColorChange}
        />
      }
    >
      <div className={styles["color-hold"]} style={{ backgroundColor: value }} />
    </Popover>
  );
};

export default ColorPicker;
