const pngtiny = require('./pnytiny');
/**
 * @description: 图像压缩
 * @param {Buffer} buffer 图片二进制数据流
 * @param {Number} quality 压缩质量，10-90，建议 80
 * @return {Promise<Buffer>} 压缩过的图片二进制数据流
 */
const imageTiny = (buffer, quality = 80) => {
  pngtiny.run();
  return new Promise((resolve, reject) => {
    try {
      const fcont = new Uint8Array(buffer);
      const fsize = fcont.byteLength;
      const dataptr = pngtiny._malloc(fsize);
      const retdata = pngtiny._malloc(4);
      pngtiny.HEAPU8.set(fcont, dataptr);
      pngtiny._tiny(dataptr, fsize, retdata, quality);
      let rdata = new Int32Array(pngtiny.HEAPU8.buffer, retdata, 1);
      const size = rdata[0];
      rdata = new Uint8Array(pngtiny.HEAPU8.buffer, dataptr, size);
      let outBuffer = null;
      if (size > 0) {
        outBuffer = Buffer.from(rdata);
      } else {
        outBuffer = Buffer.from(fcont);
      }
      resolve(outBuffer);

      pngtiny._free(dataptr);
      pngtiny._free(retdata);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = imageTiny;
