import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextBin = path.join(__dirname, '../node_modules/next/dist/bin/next');

const rawArgs = process.argv.slice(2);
const cleanedArgs = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host') {
    cleanedArgs.push('-H');
  } else {
    cleanedArgs.push(arg);
  }
}

if (!cleanedArgs.includes('dev')) {
  cleanedArgs.unshift('dev');
}

const child = spawn(process.execPath, [nextBin, ...cleanedArgs], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3000',
  },
});

child.on('exit', (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});
