const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 24, 32, 64, 192, 512];
const inputFile = path.join(__dirname, 'public', 'images', 'logo', 'spl_logo.png');
const outputDir = path.join(__dirname, 'public');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate favicon.ico (contains multiple sizes)
const icoSizes = [16, 24, 32, 64];
Promise.all(icoSizes.map(size => 
  sharp(inputFile)
    .resize(size, size)
    .toBuffer()
)).then(buffers => {
  // Create favicon.ico
  fs.writeFileSync(path.join(outputDir, 'favicon.ico'), Buffer.concat(buffers));
  console.log('Generated favicon.ico');
});

// Generate PNG icons
sizes.forEach(size => {
  if (size === 192 || size === 512) {
    sharp(inputFile)
      .resize(size, size)
      .toFile(path.join(outputDir, `logo${size}.png`))
      .then(() => console.log(`Generated logo${size}.png`))
      .catch(err => console.error(`Error generating logo${size}.png:`, err));
  }
}); 