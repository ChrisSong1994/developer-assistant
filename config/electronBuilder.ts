export default {
  rendererTarget: 'web',
  outputDir: 'release', //默认打包目录
  debugPort: 5858, //主进程调试端口，
  builderOptions: {
    appId: 'com.test.test',
    productName: '开发助手',
    publish: [
      {
        provider: 'generic',
        url: 'http://localhost/test',
      },
    ],
  },
};
