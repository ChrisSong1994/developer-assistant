import { FormOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Fragment, useState } from 'react';
import * as color from 'react-color/es/helpers/color';

import { THEME_COLOR } from '@/constants';
import { generateDateUUID } from '@/utils';
import ColorPicker from './Picker';
import ColorRecord, { IRecord } from './Record';

const Color = () => {
  const [data, setData] = useState(color.toState(THEME_COLOR, 0));
  const [recordData, setRecordData] = useState<Array<IRecord>>([
    {
      value: '#C816CD',
      title: '橄榄色',
      key: '#C816CD',
    },
    {
      value: '#1D2E54',
      title: '橄榄色',
      key: '#C816CD',
    },
  ]);

  const handleColorChange = (data: Record<string, any>) => {
    const colors = color.toState(data, data.h);
    setData(colors);
  };

  const handleColorRecordChange = (data: Array<IRecord>) => {
    setRecordData(data);
  };

  const handleRecord = () => {
    setRecordData([
      ...recordData,
      {
        value: data.hex,
        title: data.hex,
        key: generateDateUUID(),
      },
    ]);
  };

  const handleSelect = (hex: string) => {
    setData(color.toState(hex, 0));
  };

  return (
    <Fragment>
      {/* 颜色选择 */}
      <ColorPicker color={data} onChange={handleColorChange} />
      {/* 颜色记录 */}
      <Button type="primary" onClick={handleRecord}>
        <FormOutlined />
        记录一下
      </Button>

      <ColorRecord data={recordData} onChange={handleColorRecordChange} onSelect={handleSelect} />
    </Fragment>
  );
};

export default Color;
