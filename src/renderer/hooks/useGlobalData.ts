import { useEffect, useState } from 'react';

import Events from '@/utils/events';

interface IGlobalData {
  appVersion?: string;
}

const useGlobalData = () => {
  const [data, setData] = useState<IGlobalData>({});

  const handleGetData = async () => {
    const appVersion = await Events.getAppVersion();
    setData({ ...data, appVersion });
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return data;
};

export default useGlobalData;
