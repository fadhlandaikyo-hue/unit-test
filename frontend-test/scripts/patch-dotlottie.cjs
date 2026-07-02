const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targets = [
  path.join(root, 'node_modules', '@lottiefiles', 'dotlottie-web', 'dist', 'index.js'),
  path.join(root, 'node_modules', '@lottiefiles', 'dotlottie-web', 'dist', 'index.cjs'),
  path.join(root, 'node_modules', '.vite', 'deps', '@lottiefiles_dotlottie-vue.js'),
];

const replacements = [
  ['r||(r=e(i).then(()=>void 0).catch(async t=>{', 'r||(r=e({module_or_path:i}).then(()=>void 0).catch(async t=>{'],
  ['try{await e(n)}catch(e){', 'try{await e({module_or_path:n})}catch(e){'],
  ['r2 || (r2 = e5(i2).then(() => void 0).catch(async (t3) => {', 'r2 || (r2 = e5({ module_or_path: i2 }).then(() => void 0).catch(async (t3) => {'],
  ['await e5(n2);', 'await e5({ module_or_path: n2 });'],
];

let patchedCount = 0;

for (const target of targets) {
  if (!fs.existsSync(target)) {
    console.warn(`[patch-dotlottie] Skipped missing file: ${target}`);
    continue;
  }

  const original = fs.readFileSync(target, 'utf8');

  if (
    (original.includes('module_or_path:i') && original.includes('module_or_path:n')) ||
    (original.includes('module_or_path: i2') && original.includes('module_or_path: n2'))
  ) {
    console.log(`[patch-dotlottie] Already patched: ${path.basename(target)}`);
    continue;
  }

  let updated = original;

  for (const [from, to] of replacements) {
    updated = updated.replace(from, to);
  }

  if (updated === original) {
    if (!original.includes('using deprecated parameters for the initialization function')) {
      console.log(`[patch-dotlottie] Loader already looks current: ${path.basename(target)}`);
      continue;
    }

    throw new Error(`[patch-dotlottie] Loader pattern not found in ${target}`);
  }

  fs.writeFileSync(target, updated, 'utf8');
  patchedCount += 1;
  console.log(`[patch-dotlottie] Patched ${path.basename(target)}`);
}

if (patchedCount === 0) {
  console.log('[patch-dotlottie] No files required changes.');
}
