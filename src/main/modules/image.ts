import sharp from 'sharp';

export async function convertBase64ToImageBuffer({
  payload,
  format
}: {
  payload: string;
  format?: 'png' | 'jpg' | 'jpeg' | 'webp'
}) {
  let bufferValue = null;

  switch (format) {
    case 'jpeg':
    case 'jpg':
      bufferValue = await sharp(payload).jpeg({ quality: 100, chromaSubsampling: '4:4:4' }).toBuffer();
      break;
    case 'png':
      bufferValue = await sharp(payload).png().toBuffer();
      break;
    case 'webp':
      bufferValue = await sharp(payload).webp({ lossless: true }).toBuffer();
      break;
    default:
      bufferValue = await sharp(payload).png().toBuffer();
  }

  return bufferValue;
}
