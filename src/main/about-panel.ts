import * as path from 'path';

import { app } from 'electron';

/**
 * Sets Fiddle's About panel options on Linux and macOS
 *
 * @returns
 */
export function setupAboutPanel(): void {
  const contributors: Array<string> = ['ChrisSong'];

  const iconPath = path.join(__dirname, '../../assets/images/logo.png');

  app.setAboutPanelOptions({
    applicationName: 'Electron Fiddle',
    applicationVersion: app.getVersion(),
    authors: contributors,
    copyright: '© Electron Authors',
    credits: 'https://github.com/electron/fiddle/graphs/contributors',
    iconPath,
    version: process.versions.electron,
    website: 'https://electronjs.org/fiddle',
  });
}
