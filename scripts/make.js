const path = require('path');
const fs = require('fs-extra');
const builder = require('electron-builder');
const homedir = require('os').homedir();
const pkg = require('../package.json');

const { APP_NAME, root_dir, dist_dir } = require('./vars');

const TARGET_PLATFORMS_configs = {
  mac: {
    mac: ['dmg:x64', 'dmg:arm64'],
  },
  win: {
    win: ['nsis:ia32', 'nsis:x64', 'nsis:arm64', 'portable:x64'],
  },
  linux: {
    linux: ['AppImage:x64', 'AppImage:arm64', 'deb:x64', 'deb:arm64'],
  },
  all: {
    mac: ['dmg:x64', 'dmg:arm64', 'zip:universal'],
    win: ['nsis:ia32', 'nsis:x64', 'nsis:arm64', 'portable:x64', 'zip:x64' /* , 'appx:x64'*/],
    linux: ['AppImage:x64', 'AppImage:arm64', 'deb:x64', 'deb:arm64'],
  },
};

const cfg_common = {
  copyright: `Copyright © ${new Date().getFullYear()}`,
  buildVersion: pkg.version,
  directories: {
    buildResources: 'build',
    app: 'build',
  },
  electronDownload: {
    cache: path.join(homedir, '.electron'),
    mirror: 'https://registry.npmmirror.com/-/binary/electron/',
  },
  asar: true,
};

const beforeMake = async () => {
  console.log('-> beforeMake...');
  fs.removeSync(dist_dir);
  fs.ensureDirSync(dist_dir);

  const app_pkg = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
  };

  fs.writeFileSync(path.join(root_dir, 'build', 'package.json'), JSON.stringify(app_pkg, null, 2), 'utf-8');
};

const afterMake = async () => {
  console.log('-> afterMake...');
};

const doMake = async () => {
  console.log('-> make...');

  const { MAKE_FOR } = process.env;
  let targets = TARGET_PLATFORMS_configs.all;

  cfg_common.compression = 'maximum';

  if (MAKE_FOR === 'dev') {
    targets = TARGET_PLATFORMS_configs.mac;
    cfg_common.compression = 'store';
  } else if (MAKE_FOR === 'mac') {
    targets = TARGET_PLATFORMS_configs.mac;
  } else if (MAKE_FOR === 'win') {
    targets = TARGET_PLATFORMS_configs.win;
  } else if (MAKE_FOR === 'linux') {
    targets = TARGET_PLATFORMS_configs.linux;
  }

  await builder.build({
    ...targets,
    config: {
      ...cfg_common,
      appId: 'developer.assistant.app',
      productName: APP_NAME,
      mac: {
        icon: '../assets/icon.png',
        gatekeeperAssess: false,
        target: {
          target: 'default',
          arch: ['arm64', 'x64'],
        },
        hardenedRuntime: true,
        type: 'distribution',
        notarize: false,
      },
      win: {
        icon: '../assets/icon.png',
      },

      // linux: {
      //   icon: '../assets/icon.png',
      //   artifactName: '${productName}_linux_${arch}_${version}(${buildVersion}).${ext}',
      //   category: 'Utility',
      //   synopsis: 'An App for hosts management and switching.',
      //   desktop: {
      //     Name: 'Developer Assistant',
      //     Type: 'Application',
      //     GenericName: 'An App for hosts management and switching.',
      //   },
      // },
    },
  });

  console.log('done!');
};

(async () => {
  try {
    await beforeMake();
    await doMake();
    await afterMake();
    //await macSign()

    console.log('-> make Done!');
  } catch (e) {
    console.log(e);
  }
})();
