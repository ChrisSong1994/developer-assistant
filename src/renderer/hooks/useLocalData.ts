import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import localAtom from '@/stores/local';
import Events from '@/utils/events';

export default function () {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useAtom(localAtom);

  const updateData = async (value: Record<string, any>) => {
    const newData = { ...data, ...value };
    await Events.setLocalData(newData);
    await initData();
  };

  const initData = async () => {
    setLoading(true);
    const confData = await Events.getLocalData();
    setData(confData);
    setLoading(false);
  };

  const clearLocalData = async () => {
    await Events.clearLocalData();
    await initData();
  };

  useEffect(() => {
    initData();
  }, []);

  return { data, loading, setData: updateData, clearData: clearLocalData };
}
