import fs from 'fs-extra';

export const getFileFromPath = async ({ filePath }: { filePath: string }) => {
  const buff = await fs.readFile(filePath);
  return buff.toString();
};
