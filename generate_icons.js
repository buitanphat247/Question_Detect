// Tạo icon PNG dạng base64 / canvas hoặc BMP trực tiếp không phụ thuộc thư viện ngoài
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'icons');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Hàm tạo buffer ảnh PNG đơn giản kích thước 1x1 hoặc ảnh SVG / PNG chuẩn
// Để đơn giản và tương thích 100% không cần node-canvas, chúng ta tạo icon bằng PNG binary minimal hoặc dùng pure JS PNG builder
function createSimplePng(width, height) {
  // Tạo 1 PNG hợp lệ với header IHDR, IDAT, IEND
  const zlib = require('zlib');

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with scanline filter bytes
  const scanlines = [];
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.45;

  for (let y = 0; y < height; y++) {
    const line = Buffer.alloc(1 + width * 4);
    line[0] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist <= radius) {
        // Gradient tím -> xanh dương (79, 70, 229) -> (147, 51, 234)
        const t = (x + y) / (width + height);
        const r = Math.round(79 * (1 - t) + 147 * t);
        const g = Math.round(70 * (1 - t) + 51 * t);
        const b = Math.round(229 * (1 - t) + 234 * t);
        
        // Vẽ thêm chấm hỏi hoặc khối vuông trắng ở giữa
        const isCenter = Math.abs(x - cx) < width * 0.25 && Math.abs(y - cy) < height * 0.25;
        if (isCenter && width >= 48) {
          line[idx] = 255;
          line[idx + 1] = 255;
          line[idx + 2] = 255;
          line[idx + 3] = 255;
        } else {
          line[idx] = r;
          line[idx + 1] = g;
          line[idx + 2] = b;
          line[idx + 3] = 255;
        }
      } else {
        // Trong suốt
        line[idx] = 0;
        line[idx + 1] = 0;
        line[idx + 2] = 0;
        line[idx + 3] = 0;
      }
    }
    scanlines.push(line);
  }

  const rawData = Buffer.concat(scanlines);
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.slice(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// CRC32 implementation
function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  table[i] = c;
}

[16, 48, 128].forEach(size => {
  const pngBuf = createSimplePng(size, size);
  fs.writeFileSync(path.join(dir, `icon${size}.png`), pngBuf);
  console.log(`Generated icon${size}.png`);
});
