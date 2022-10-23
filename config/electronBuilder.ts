export default {
  rendererTarget: 'web',
  outputDir: 'release', //默认打包目录
  debugPort: 5858, //主进程调试端口，
  builderOptions: {
    productName: 'Developer Assistant',
    appId: 'developer.assistant.app',
    // asar: true,
    mac: {
      icon: '../assets/icon.png',
      target: {
        target: 'default',
        arch: ['arm64', 'x64'],
      },
      type: 'distribution',
      hardenedRuntime: true,
    },
    win: {
      icon: '../assets/icon.png',
    },
  },
};
