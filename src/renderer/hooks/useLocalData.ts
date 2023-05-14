import Events from '@/utils/events';
import _ from 'lodash';
import { useEffect, useState } from 'react';

export default function () {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Record<string, any>>({});

  const updateData = async (value: Record<string, any>) => {
    const newData = { ...data, ...value };
    setData(newData);
    await Events.setLocalData(newData);
  };

  const removeDataByKey = async (keys: string[] = []) => {
    const newData = _.omit({ ...data }, keys);
    setData(newData);
    await Events.setLocalData(newData);
  };

  const clearLocalData = async () => {
    await Events.clearLocalData();
    const res = await Events.getLocalData();
    setData(res);
  };

  useEffect(() => {
    (async () => {
      const res = await Events.getLocalData();
      setData(res);
      setLoading(false);
    })();
  }, []);

  const result = { data, loading, setData: updateData, clearData: clearLocalData };

  return { ...result };
}
