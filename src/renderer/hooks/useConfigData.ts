import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import configAtom from '@/renderer/stores/config';
import Events from '@/renderer/utils/events';

export default function () {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useAtom(configAtom);

  const updateData = async (value: Record<string, any>) => {
    const newData = { ...data, ...value };
    await Events.setConfData(newData);
    await initData();
  };

  const initData = async () => {
    setLoading(true);
    const confData = await Events.getConfData();
    setData(confData);
    setLoading(false);
  };

  useEffect(() => {
    initData();
  }, []);

  return { data, loading, setData: updateData };
}
