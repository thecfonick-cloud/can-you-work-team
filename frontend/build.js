import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Build frontend
console.log('--- Building main frontend application ---');
execSync('npx vite build', { stdio: 'inherit' });

// 2. Build admin-alexa
console.log('--- Building admin-alexa application ---');
const adminDir = path.resolve(__dirname, '../admin-alexa');

console.log('Installing admin-alexa dependencies...');
execSync('npm install', { cwd: adminDir, stdio: 'inherit' });

console.log('Running admin-alexa build...');
execSync('npm run build', { cwd: adminDir, stdio: 'inherit' });

// 3. Copy admin-alexa build output to frontend dist/admin-alexa
console.log('--- Copying admin-alexa dist to frontend dist/admin-alexa ---');
const adminDist = path.join(adminDir, 'dist');
const targetDir = path.resolve(__dirname, 'dist/admin-alexa');

// Helper to recursively copy directories
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

copyFolderSync(adminDist, targetDir);
console.log('--- Unified build completed successfully! ---');
