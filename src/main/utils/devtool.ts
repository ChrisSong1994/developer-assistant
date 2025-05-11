import { installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

export const installDevtool = async () => {
  await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], {
    loadExtensionOptions: {
      allowFileAccess: true,
    },
  });
};
