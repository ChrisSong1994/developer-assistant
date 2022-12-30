import { Fragment, useState } from 'react';
import * as color from 'react-color/es/helpers/color';

import ColorPicker from './Picker';

const DEFAULT_COLOR = '#1d2e54';

export default function () {
  const [data, setData] = useState(color.toState(DEFAULT_COLOR, 0));

  const handleColorChange = (data: Record<string, any>) => {
    const colors = color.toState(data, data.h);
    setData(colors);
  };

  return (
    <Fragment>
      <ColorPicker color={data} onChange={handleColorChange} />
    </Fragment>
  );
}
