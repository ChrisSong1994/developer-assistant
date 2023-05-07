import { useState } from 'react';

const useUpdate = () => {
  const [_data, setData] = useState<object>({});

  const update = () => {
    setData({});
  };

  return update;
};

export default useUpdate;
