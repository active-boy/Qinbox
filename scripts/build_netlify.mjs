import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publishDir = resolve(root, 'netlify/public');
const staticSource = resolve(root, 'static');
const staticTarget = resolve(publishDir, 'static');

rmSync(publishDir, { recursive: true, force: true });
mkdirSync(publishDir, { recursive: true });
cpSync(staticSource, staticTarget, { recursive: true });
const giftImageDir = resolve(staticTarget, 'images/gifts');
for (const name of readdirSync(giftImageDir)) {
  if (name.endsWith('.png')) rmSync(resolve(giftImageDir, name));
}

let html = readFileSync(resolve(root, 'templates/index.html'), 'utf8');
html = html
  .replace('class="auth-screen {% if account_id %}hidden{% endif %}"', 'class="auth-screen"')
  .replace('class="game-lobby {% if not account_id %}hidden{% endif %}"', 'class="game-lobby hidden"')
  .replace("{{ account_name or '' }}", '')
  .replace(
    '<script>window.QIN_ACCOUNT={{ account_id|tojson }};window.QIN_ACCOUNT_NAME={{ account_name|tojson }};</script>',
    '<script>window.QIN_ACCOUNT=null;window.QIN_ACCOUNT_NAME="";window.QIN_STATIC_HOST=true;</script>',
  );

if (html.includes('{{') || html.includes('{%')) {
  throw new Error('Netlify 静态首页仍包含未处理的 Flask 模板标记。');
}

writeFileSync(resolve(publishDir, 'index.html'), html, 'utf8');
console.log('Netlify H5 已生成：netlify/public/index.html 和 netlify/public/static/');
