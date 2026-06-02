import { build } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log('--- Building main frontend application ---');
  await build({
    configFile: path.resolve(__dirname, 'vite.config.js')
  });

  console.log('--- Building admin-alexa application ---');
  const adminDir = path.resolve(__dirname, '../admin-alexa');
  await build({
    configFile: path.resolve(adminDir, 'vite.config.js'),
    root: adminDir
  });

  console.log('--- Copying admin-alexa dist to frontend/dist/admin-alexa ---');
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
}

run().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
