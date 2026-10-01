const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('🚀 Bắt đầu quá trình Build & Obfuscate bảo vệ mã nguồn...');

// 1. Tạo thư mục dist sạch
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Cấu hình Obfuscator mạnh mẽ chống dịch ngược (Anti-Reversing, String Array Encryption, NO EVAL cho MV3 Service Worker)
const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: false, // Để dung lượng vừa phải và hiệu năng mượt
  debugProtection: false,   // Tránh làm crash môi trường content script
  disableConsoleOutput: false, // Không inject wrapper window.console làm lỗi Service Worker
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,     // Giữ global APIs Chrome
  selfDefending: false,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.75,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.8,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  target: 'browser-no-eval' // Bắt buộc cho Chrome Extension MV3 và Service Worker
};

// 3. Obfuscate các file JavaScript
const jsFiles = ['config.js', 'background.js', 'content.js', 'popup.js'];

for (const file of jsFiles) {
  const srcPath = path.join(rootDir, file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    console.log(`🔒 Đang mã hóa & obfuscate [${file}]...`);
    const code = fs.readFileSync(srcPath, 'utf8');
    const obfuscated = JavaScriptObfuscator.obfuscate(code, obfuscatorOptions);
    fs.writeFileSync(destPath, obfuscated.getObfuscatedCode(), 'utf8');
  }
}

// 4. Sao chép các file tài nguyên tĩnh (manifest.json, popup.html, popup.css, icons)
console.log('📦 Sao chép tài nguyên tĩnh (manifest.json, popup.html, popup.css, icons)...');

fs.copyFileSync(path.join(rootDir, 'manifest.json'), path.join(distDir, 'manifest.json'));
fs.copyFileSync(path.join(rootDir, 'popup.html'), path.join(distDir, 'popup.html'));
fs.copyFileSync(path.join(rootDir, 'popup.css'), path.join(distDir, 'popup.css'));

// Sao chép icons
const iconsSrcDir = path.join(rootDir, 'icons');
const iconsDestDir = path.join(distDir, 'icons');
fs.mkdirSync(iconsDestDir, { recursive: true });

if (fs.existsSync(iconsSrcDir)) {
  const iconFiles = fs.readdirSync(iconsSrcDir);
  for (const ic of iconFiles) {
    fs.copyFileSync(path.join(iconsSrcDir, ic), path.join(iconsDestDir, ic));
  }
}

console.log('✅ HOÀN THÀNH BUILD & MÃ HÓA!');
console.log(`📁 Thư mục Extension thành phẩm: ${distDir}`);
