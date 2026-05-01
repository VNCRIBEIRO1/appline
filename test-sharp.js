const sharp = require('sharp');
const fs = require('fs');

async function test() {
  try {
    console.log('Testing sharp...');
    // Create a dummy 100x100 buffer
    const buffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).png().toBuffer();

    console.log('Dummy buffer created.');

    const image = sharp(buffer).resize(4096, 4096, { fit: 'cover' });
    
    let minQuality = 10;
    let maxQuality = 100;
    let currentQuality = 80;
    let finalBuffer = await image.jpeg({ quality: currentQuality }).toBuffer();

    console.log(`Initial size: ${(finalBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    for (let i = 0; i < 8; i++) {
      const size = finalBuffer.length;
      console.log(`Step ${i}: Quality ${currentQuality}, Size ${(size / 1024 / 1024).toFixed(2)} MB`);
      
      if (size >= 4 * 1024 * 1024 && size <= 7 * 1024 * 1024) break;

      if (size < 4 * 1024 * 1024) minQuality = currentQuality;
      else maxQuality = currentQuality;

      currentQuality = Math.floor((minQuality + maxQuality) / 2);
      finalBuffer = await image.jpeg({ quality: currentQuality }).toBuffer();
    }

    console.log('Success!');
    console.log(`Final Quality: ${currentQuality}`);
    console.log(`Final Size: ${(finalBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  } catch (err) {
    console.error('Sharp test failed:', err);
  }
}

test();
