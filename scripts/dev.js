/** Backend va frontend ni bitta buyruq bilan ishga tushiradi: npm run dev */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const run = (name, cwd, color) => {
  const p = spawn(npm, ['run', 'dev'], { cwd: path.join(root, cwd), shell: false });
  const write = (buf) =>
    String(buf).split('\n').filter(Boolean).forEach((l) => console.log(`\x1b[${color}m[${name}]\x1b[0m ${l}`));
  p.stdout.on('data', write);
  p.stderr.on('data', write);
  return p;
};

const procs = [run('api', 'backend', 36), run('web', 'frontend', 35)];
const stop = () => { procs.forEach((p) => p.kill('SIGTERM')); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
