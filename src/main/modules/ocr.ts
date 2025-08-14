import MacOCR from '@cherrystudio/mac-system-ocr';
import path from 'path';

// With options
export async function getImgOcrText(imgPath: string) {
  const options = {
    languages: 'en-US, zh-Hans', // Specify recognition languages
    recognitionLevel: MacOCR.RECOGNITION_LEVEL_ACCURATE,
    minConfidence: 0.5,
  };

  const text = await MacOCR.recognizeFromPath(path.resolve(imgPath), options);
  return text;
}
