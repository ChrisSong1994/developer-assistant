import { getLocalData, setLocalData } from '@/actions';
import { useEffect, useState } from 'react';

export default function () {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Record<string, any>>({});

  const updateData = async (value: Record<string, any>) => {
    const newData = { ...data, ...value };
    setData(newData);
    await setLocalData(newData);
  };

  useEffect(() => {
    (async () => {
      const res = await getLocalData();
      setData(res);
      setLoading(false);
    })();
  }, []);

  return { data, loading, setData: updateData };
}
