import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Extract base64 data
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Resize to 4096x4096px
    let image = sharp(buffer).resize(4096, 4096, {
      fit: "cover",
      position: "center",
    });

    // Target size in bytes: 4MB to 7MB
    const MIN_SIZE = 4 * 1024 * 1024;
    const MAX_SIZE = 7 * 1024 * 1024;

    let minQuality = 10;
    let maxQuality = 100;
    let currentQuality = 80;
    let finalBuffer = await image.jpeg({ quality: currentQuality }).toBuffer();

    // Binary search for optimal quality to hit 4-7MB
    for (let i = 0; i < 8; i++) {
      const size = finalBuffer.length;
      
      if (size >= MIN_SIZE && size <= MAX_SIZE) {
        break;
      }

      if (size < MIN_SIZE) {
        minQuality = currentQuality;
      } else {
        maxQuality = currentQuality;
      }

      currentQuality = Math.floor((minQuality + maxQuality) / 2);
      finalBuffer = await image.jpeg({ quality: currentQuality }).toBuffer();
    }

    // If still too small at 100 quality, just use 100
    if (finalBuffer.length < MIN_SIZE && currentQuality < 100) {
      finalBuffer = await image.jpeg({ quality: 100 }).toBuffer();
    }

    const resultBase64 = `data:image/jpeg;base64,${finalBuffer.toString("base64")}`;
    
    return NextResponse.json({ 
      upscaledImage: resultBase64,
      sizeMB: (finalBuffer.length / (1024 * 1024)).toFixed(2),
      quality: currentQuality
    });

  } catch (error) {
    console.error("Upscale error:", error);
    return NextResponse.json({ error: "Failed to upscale image" }, { status: 500 });
  }
}
