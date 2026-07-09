import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  { regex: /emerald-600/g, replacement: 'brand-purple-600' },
  { regex: /emerald-700/g, replacement: 'brand-purple-700' },
  { regex: /emerald-500/g, replacement: 'brand-purple-500' },
  { regex: /emerald-400/g, replacement: 'brand-purple-400' },
  { regex: /emerald-300/g, replacement: 'brand-purple-300' },
  { regex: /emerald-200/g, replacement: 'brand-purple-200' },
  { regex: /emerald-100/g, replacement: 'brand-purple-100' },
  { regex: /emerald-50/g, replacement: 'brand-purple-50' },
  { regex: /violet-800/g, replacement: 'brand-purple-800' },
  { regex: /violet-600/g, replacement: 'brand-purple-500' },
  { regex: /violet-100/g, replacement: 'brand-purple-100' },
  { regex: /violet-50/g, replacement: 'brand-purple-50' },
  { regex: /bg-gray-50/g, replacement: 'bg-brand-cream' },
  { regex: /bg-gray-100/g, replacement: 'bg-brand-cream-dark' }
];

let updatedFiles = 0;

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedFiles++;
      console.log(`Updated ${filePath}`);
    }
  }
});

console.log(`Finished processing. Updated ${updatedFiles} files.`);
