import Events from '@/utils/events';
import { useEffect, useState } from 'react';

export default function () {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Record<string, any>>({});

  const updateData = async (value: Record<string, any>) => {
    const newData = { ...data, ...value };
    setData(newData);
    await Events.setConfData(newData);
  };

  useEffect(() => {
    (async () => {
      const confData = await Events.getConfData();
      const appVersion = await Events.getAppVersion();
      const openAtLogin = await Events.getOpenAtLogin();
      setData({ ...confData, appVersion, openAtLogin });
      setLoading(false);
    })();
  }, []);

  return { data, loading, setData: updateData };
}
