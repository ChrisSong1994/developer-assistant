import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import localAtom from '@/renderer/stores/local';
import Events from '@/renderer/utils/events';

export default function () {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useAtom(localAtom);

  const updateData = async (value: Record<string, any>) => {
    const newData = { ...data, ...value };
    await Events.setUserData(newData);
    await initData();
  };

  const initData = async () => {
    setLoading(true);
    const confData = await Events.getUserData();
    setData(confData);
    setLoading(false);
  };

  const clearLocalData = async () => {
    await Events.clearUserData();
    await initData();
  };

  useEffect(() => {
    initData();
  }, []);

  return { data, loading, setData: updateData, clearData: clearLocalData };
}
