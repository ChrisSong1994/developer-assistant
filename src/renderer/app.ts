import Events from '@/utils/events';
import { loader } from '@monaco-editor/react';

(async () => {
  const vsPath = await Events.getPublicFilePath({ name: 'vs' });
  loader.config({ paths: { vs: process.env.NODE_ENV === 'development' ? '/vs' : vsPath } });
})();
