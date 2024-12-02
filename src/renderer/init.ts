import { loader } from '@monaco-editor/react';
import Events from '@/utils/events';

export const init = async () => {
  const vsPath = await Events.getPublicFilePath({ name: 'vs' });
  loader.config({ paths: { vs: process.env.NODE_ENV === 'development' ? '/vs' : vsPath } });
};
