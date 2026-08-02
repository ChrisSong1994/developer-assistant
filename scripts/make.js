const path = require('path');
const fs = require('fs-extra');
const builder = require('electron-builder');
const homedir = require('os').homedir();
const { execSync } = require('child_process');
const pkg = require('../package.json');

const root_dir = path.normalize(path.join(__dirname, '..'))
const dist_dir = path.normalize(path.join(__dirname, '..', 'dist'))

const APP_NAME = 'Developer Assistant'

// 运行时需要随产物携带的原生依赖(与 rspack main 配置 externals 对应)
// 用安装后的确切版本号,避免 build/ 锁文件与根 lockfile 漂移
const sharpVersion = require(path.join(root_dir, 'node_modules', 'sharp', 'package.json')).version;
const NATIVE_DEPENDENCIES = { sharp: sharpVersion };

// 各打包平台需要预装的 sharp 架构(win32-ia32 无可用预编译,已去掉)
const SUPPORTED_ARCHITECTURES = {
  win: { os: ['win32'], cpu: ['x64', 'arm64'] },
  mac: { os: ['darwin'], cpu: ['x64', 'arm64'] },
  linux: { os: ['linux'], cpu: ['x64', 'arm64'] },
  all: { os: ['win32', 'darwin'], cpu: ['x64', 'arm64'] },
};

const TARGET_PLATFORMS_configs = {
  mac: {
    mac: ['dmg:x64', 'dmg:arm64'],
  },
  // 注意:不打包 nsis:ia32 —— sharp 0.35 在 win32-ia32 无可用预编译二进制(pnpm supportedArchitectures 装不上)
  win: {
    win: ['nsis:x64', 'nsis:arm64', 'portable:x64'],
  },
  linux: {
    linux: ['AppImage:x64', 'AppImage:arm64', 'deb:x64', 'deb:arm64'],
  },
  all: {
    mac: ['dmg:x64', 'dmg:arm64', 'zip:universal'],
    win: ['nsis:x64', 'nsis:arm64', 'portable:x64', 'zip:x64' /* , 'appx:x64'*/],
    // linux: ['AppImage:x64', 'AppImage:arm64', 'deb:x64', 'deb:arm64'],
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
    mirror: 'https://npmmirror.com/mirrors/electron/',
  },
  mac: {
    electronLanguages: ['en'],
  },
  dmg: {
    writeUpdateInfo: false,
  },
  asar: true,
};

const beforeMake = async () => {
  console.log('-> beforeMake...');
  fs.removeSync(dist_dir);
  fs.ensureDirSync(dist_dir);

  const { MAKE_FOR } = process.env;
  const supportedArchitectures = SUPPORTED_ARCHITECTURES[MAKE_FOR] || SUPPORTED_ARCHITECTURES.all;

  // build/package.json 声明运行时原生依赖 + pnpm 跨架构安装配置
  const app_pkg = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    main: pkg.main,
    dependencies: NATIVE_DEPENDENCIES,
    pnpm: { supportedArchitectures },
  };

  fs.writeFileSync(path.join(root_dir, 'build', 'package.json'), JSON.stringify(app_pkg, null, 2), 'utf-8');

  // 用 hoisted 布局安装(pnpm isolated 布局下依赖是虚拟 store 里的兄弟 symlink,
  // 打成扁平真实文件后 sharp 会找不到 detect-libc/semver 等;hoisted 布局依赖全部提升到顶层,与 electron-builder 收集一致)
  fs.writeFileSync(path.join(root_dir, 'build', '.npmrc'), 'node-linker=hoisted\n', 'utf-8');

  // 关键:让 build/ 成为自成一体的 pnpm 生产项目,electron-builder 的依赖收集器
  // 会在 build/ 命中锁文件,只收集 sharp 闭包进 asar;否则会回退到项目根,
  // 把 antd/react/monaco 等全量生产依赖错误打包进去
  execSync('pnpm install --prod', { cwd: path.join(root_dir, 'build'), stdio: 'inherit' });
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
      asarUnpack: ['**/*.node'],
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
