import { configDBRegistory } from './configData';
import { LocalDBRegistory } from './localData';

export * from './configData';
export * from './localData';

export const dbRegistory = async () => {
    
  await configDBRegistory();
  await LocalDBRegistory();
};
