
const JSDELIVR_PREFIX = 'https://cdn.jsdelivr.net/npm/';

export async function fetchVersion(pkg: string) {
  const raw = await fetch(`${JSDELIVR_PREFIX}${pkg}/package.json`).then((r) => r.json());
  return raw.version;
}

export function getJsdelivrUrl(pkg: string, path: string = '/+esm'): string {
  return `${JSDELIVR_PREFIX}${pkg}${path || ''}`;
}

export function importJsdelivr<T = any>(pkg: string, path?: string): Promise<T> {
  return importUrl(getJsdelivrUrl(pkg, path));
}

export function importUrl<T = any>(url: string, sandbox?: boolean): Promise<T> {
  // In Electron renderer, direct import() of external URL might be blocked by CSP or Node context.
  // However, with webSecurity: false and nodeIntegration: true, it might work or fail depending on setup.
  // The original implementation used iframe for sandbox.
  
  // For now, let's try direct import. If it fails, we might need a different strategy (e.g. download in main process).
  // Note: Vite/Rspack might complain about dynamic import of variables.
  
  // Using new Function to bypass some bundler restrictions on import()
  return new Function('url', 'return import(url)')(url);
}

export function del<T extends Array<any>>(arr: T, values: T[number][]): T {
  return arr.filter((v) => !values.includes(v)) as T;
}

export async function resolveDefault(p: Promise<any>) {
  const module = await p;
  return module.default || module;
}
