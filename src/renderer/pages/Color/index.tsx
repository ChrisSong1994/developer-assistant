import { useState } from 'react';
import * as color from 'react-color/es/helpers/color';

import PageLayout from '@/components/PageLayout';
import ColorPicker from './Picker';

const DEFAULT_COLOR = '#1d2e54';

interface IRecord {
  value: string;
  title: string;
}

const Color = () => {
  const [data, setData] = useState(color.toState(DEFAULT_COLOR, 0));
  const [recordData, setRecordData] = useState<Array<IRecord>>([]);

  const handleColorChange = (data: Record<string, any>) => {
    const colors = color.toState(data, data.h);
    setData(colors);
  };

  return (
    <PageLayout>
      {/* 颜色选择 */}
      <ColorPicker color={data} onChange={handleColorChange} />
      {/* 颜色记录 */}
      {/* <Button type="primary"> 记录一下 </Button> */}
    </PageLayout>
  );
};

export default Color;
