import { useAtom } from 'jotai';
import { getDefaultStore } from 'jotai';
import { useEffect, useState } from 'react';

import configAtom from '@/renderer/stores/config';
import Events from '@/renderer/utils/events';

const store = getDefaultStore();

export default function () {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useAtom(configAtom);

  const initData = async () => {
    setLoading(true);
    const confData = await Events.getConfData();
    setData(confData);
    setLoading(false);
  };

  const updateData = async (value: Record<string, any>) => {
    // 基于 atom 当前最新值 merge，而不是过期的闭包 data，
    // 避免拖拽等连续 setConfigData 时旧值覆盖新值
    const currentData = store.get(configAtom);
    const newData = { ...currentData, ...value };
    await Events.setConfData(newData);
    await initData();
  };

  useEffect(() => {
    initData();
  }, []);

  return { data, loading, setData: updateData };
}
