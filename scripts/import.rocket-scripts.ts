import { spawn } from 'child_process';
import { config } from 'dotenv';
import path from 'path';

// .env
config();

if (!process.env.HOME || !process.env.ROCKET_SCRIPTS_HOME) {
  throw new Error(`Undefined $HOME`);
}

const cwd: string = process.cwd();

// import packages
spawn(`npm run build -- --out-dir "${path.resolve(cwd, 'out/rocket-scripts')}"`, {
  cwd: process.env.ROCKET_SCRIPTS_HOME,
  shell: true,
  stdio: 'inherit',
});