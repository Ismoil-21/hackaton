/**
 * Uchala jarayonni bitta buyruq bilan ishga tushiradi: npm run dev
 *   api   :5001   backend/
 *   user  :5173   user/
 *   admin :5174   admin/
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const run = (name, dir, color) => {
  const p = spawn(npm, ['run', 'dev'], { cwd: path.join(root, dir), shell: false });
  const write = (buf) =>
    String(buf).split('\n').filter(Boolean).forEach((l) => console.log(`\x1b[${color}m[${name}]\x1b[0m ${l}`));
  p.stdout.on('data', write);
  p.stderr.on('data', write);
  return p;
};

const procs = [run('api  ', 'backend', 36), run('user ', 'user', 35), run('admin', 'admin', 33)];
const stop = () => { procs.forEach((p) => p.kill('SIGTERM')); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
