import fs from 'fs-extra';

export const getFileFromPath = async ({
  filePath,
  encoding = 'utf-8',
}: {
  filePath: string;
  encoding?: BufferEncoding;
}) => {
  const buff = await fs.readFile(filePath);
  return buff.toString(encoding);
};

