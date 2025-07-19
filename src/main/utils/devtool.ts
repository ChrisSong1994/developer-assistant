import { installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

export const installDevtool = async () => {
  // react dev tools 需要reload 才能生效
  await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], {
    loadExtensionOptions: {
      allowFileAccess: true,
    },
  });
};
