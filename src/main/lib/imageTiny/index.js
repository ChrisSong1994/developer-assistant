
const pngtiny = require('./pnytiny');

let readyPromise = null;

function ensureReady() {
  if (readyPromise) return readyPromise;
  
  readyPromise = new Promise((resolve, reject) => {
    // If already running and initialized
    if (pngtiny.calledRun && pngtiny._malloc) {
      resolve();
      return;
    }
    
    // Timeout safety (5s)
    const timer = setTimeout(() => {
      // Check again if it succeeded silently
      if (pngtiny._malloc) {
        resolve();
      } else {
        reject(new Error('pngtiny initialization timeout'));
      }
    }, 5000);

    // Intercept onRuntimeInitialized
    const originalOnRuntimeInitialized = pngtiny.onRuntimeInitialized;
    pngtiny.onRuntimeInitialized = function() {
      clearTimeout(timer);
      if (originalOnRuntimeInitialized) originalOnRuntimeInitialized.apply(this, arguments);
      resolve();
    };
    
    try {
      pngtiny.run();
    } catch (e) {
      clearTimeout(timer);
      // If run throws, it might be because it was already run?
      // Check if _malloc is available
      if (pngtiny._malloc) {
        resolve();
      } else {
        reject(e);
      }
    }
  });
  
  return readyPromise;
}

/**
 * @description: 图像压缩
 * @param {Buffer} buffer 图片二进制数据流
 * @param {Number} quality 压缩质量，10-90，建议 80
 * @return {Promise<Buffer>} 压缩过的图片二进制数据流
 */
const imageTiny = async (buffer, quality = 80) => {
  await ensureReady();
  
  return new Promise((resolve, reject) => {
    try {
      const fcont = new Uint8Array(buffer);
      const fsize = fcont.byteLength;
      
      if (typeof pngtiny._malloc !== 'function') {
        throw new Error('pngtiny._malloc is not a function');
      }

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
