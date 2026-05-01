import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";

const NICHE_DATA: Record<string, { label: string; prompts: string[] }> = {
  natureza: {
    label: "Natureza",
    prompts: [
      "A breathtaking mountain landscape at golden hour with dramatic clouds and snow-capped peaks, photorealistic, ultra-detailed, professional photography",
      "A serene forest path in autumn with sunlight filtering through colorful foliage, misty morning atmosphere, photorealistic",
      "Crystal clear tropical ocean waves crashing on pristine white sand beach, aerial perspective, vibrant colors, photorealistic",
      "Majestic waterfall in a lush green rainforest, long exposure photography effect, misty atmosphere, ultra-detailed",
      "Vast lavender field in full bloom under a dramatic sunset sky, photorealistic, professional landscape photography",
    ],
  },
  negocios: {
    label: "Negócios / Tech",
    prompts: [
      "Modern open office workspace with natural light, diverse professionals collaborating around a large table, laptops and documents, professional corporate photography",
      "Futuristic technology concept with glowing circuit boards and data streams, dark background, blue and cyan tones, professional tech visualization",
      "Business team in a glass-walled meeting room with city skyline view, discussing charts and presentations, corporate photography",
      "Entrepreneur working on laptop at a minimalist modern desk with city view, productivity and success concept, warm lighting",
      "Digital transformation concept, hands holding smartphone with holographic data interface, blue and white tones, professional",
    ],
  },
  pessoas: {
    label: "Pessoas / Lifestyle",
    prompts: [
      "Happy multiethnic family having a picnic in a sunny park, authentic candid moment, warm natural lighting, lifestyle photography",
      "Young professional woman working at a coffee shop with laptop, confident and focused expression, warm ambient lighting",
      "Group of diverse friends laughing and having fun at a rooftop party, golden hour lighting, lifestyle photography",
      "Senior couple walking hand in hand on a beach at sunset, romantic and joyful, warm tones, lifestyle photography",
      "Fit young man doing yoga on a mountain peak at sunrise, wellness and mindfulness concept, dramatic landscape",
    ],
  },
  comida: {
    label: "Comida",
    prompts: [
      "Beautifully plated gourmet pasta dish with fresh herbs and parmesan, restaurant quality, professional food photography, dark moody background",
      "Fresh colorful fruit and vegetable smoothie bowls arranged in a flat lay, vibrant colors, healthy eating concept, top view",
      "Artisan sourdough bread fresh from the oven on rustic wooden table, golden crust, steam rising, warm lighting, professional food photography",
      "Elegant chocolate dessert cake with gold leaf decoration on a dark marble surface, luxury bakery style, close-up detail",
      "Brazilian barbecue churrasco spread with various grilled meats and side dishes, festive outdoor setting, professional food photography",
    ],
  },
  arquitetura: {
    label: "Arquitetura",
    prompts: [
      "Stunning modern glass and steel skyscraper reflecting blue sky, dramatic low angle shot, architectural photography",
      "Cozy minimalist Scandinavian interior living room with large windows, natural wood elements, and indoor plants, soft natural lighting",
      "Historic European cobblestone street lined with colorful buildings, afternoon golden light, travel photography",
      "Futuristic airport terminal with curved white architecture and large skylights, dramatic perspective, architectural visualization",
      "Luxurious modern villa with infinity pool overlooking tropical ocean at sunset, architectural photography",
    ],
  },
  animais: {
    label: "Animais",
    prompts: [
      "Majestic lion portrait in golden savanna grass at sunset, intense gaze, professional wildlife photography",
      "Playful golden retriever puppy running in a field of flowers, joyful expression, warm natural light, pet photography",
      "Colorful tropical parrot perched on a branch in a lush rainforest, vibrant plumage, wildlife photography",
      "Humpback whale breaching dramatically from ocean surface, spray and mist, professional wildlife photography",
      "Butterfly with vivid wings resting on a blooming flower, macro photography, ultra-detailed, soft bokeh background",
    ],
  },
  saude: {
    label: "Saúde / Fitness",
    prompts: [
      "Fit woman doing yoga on a beach at sunrise, warrior pose, peaceful and serene atmosphere, wellness photography",
      "Healthy meal prep bowls with colorful vegetables, grains, and proteins arranged on a white kitchen counter, nutrition concept",
      "Athletic man running on a mountain trail at golden hour, action shot, fitness and endurance concept, professional sports photography",
      "Calm meditation scene with person sitting by a lake at sunrise, mindfulness and mental health concept, peaceful atmosphere",
      "Modern gym interior with diverse people working out, bright and energetic atmosphere, fitness lifestyle photography",
    ],
  },
  viagem: {
    label: "Viagem / Turismo",
    prompts: [
      "Iconic Tokyo street scene at night with neon signs and busy pedestrians, rain reflections on pavement, travel photography",
      "Traveler with backpack standing on edge of Machu Picchu ruins overlooking mountains and clouds, adventure travel",
      "Stunning Greek island white-washed buildings with blue domes overlooking turquoise Aegean Sea, iconic travel photography",
      "Venetian canal at sunrise with gondola and reflection in still water, romantic travel photography, warm light",
      "Safari jeep in front of a herd of elephants crossing a river in African savanna at sunset, travel photography",
    ],
  },
  abstrato: {
    label: "Abstrato / Arte",
    prompts: [
      "Stunning fluid abstract art with vibrant swirling blues, golds, and purples, luxury marble texture, high resolution",
      "Geometric abstract composition with glowing neon lines and shapes on dark background, futuristic digital art",
      "Abstract watercolor background with soft pastel gradients blending harmoniously, artistic texture, professional",
      "Colorful bokeh abstract background with overlapping circles of light, dreamy and ethereal atmosphere",
      "Dynamic abstract motion blur concept with gold and black elements, luxury and energy, professional digital art",
    ],
  },
  brasil: {
    label: "Cultura Brasileira",
    prompts: [
      "Aerial view of Rio de Janeiro with Christ the Redeemer and Guanabara Bay at golden hour, stunning landscape photography",
      "Vibrant Brazilian carnival celebration with colorful costumes and feathers, festive atmosphere, cultural photography",
      "Traditional Brazilian food spread with feijoada, rice, farofa and caipirinha on a rustic wooden table, food photography",
      "Amazon rainforest aerial view with winding river through dense jungle, nature and ecology concept, drone photography",
      "Beautiful Ipanema beach at sunset with surfers and cityscape in background, iconic Brazil travel photography",
    ],
  },
  moda: {
    label: "Moda / Beleza",
    prompts: [
      "High fashion portrait of a model in elegant white dress on a minimalist white studio background, professional fashion photography",
      "Luxury perfume bottle with roses and silk fabric on marble surface, commercial product photography, warm lighting",
      "Close-up portrait with perfect skin and natural makeup, soft studio lighting, beauty photography, professional",
      "Modern streetwear fashion editorial in urban environment, dynamic pose, high contrast lighting, fashion photography",
      "Elegant jewelry collection flatlay on white marble surface, minimalist luxury product photography, professional",
    ],
  },
  esportes: {
    label: "Esportes",
    prompts: [
      "Soccer player making a powerful kick in a stadium with crowd in background, action sports photography, dynamic motion",
      "Surfer riding a massive ocean wave, action shot, spray and foam, professional sports photography",
      "Cyclist racing on a mountain road at sunrise, determination and speed, professional cycling photography",
      "Basketball player dunking in an outdoor court at sunset, urban sports photography, dynamic action",
      "Marathon runners at the start of a race in a big city, crowd and energy, sports event photography",
    ],
  },
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY não configurada." }, { status: 500 });
  }

  const body = await req.json();
  const { niches, quantity, customPrompt } = body as { 
    niches: string[]; 
    quantity: number;
    customPrompt?: string;
  };

  if ((!niches || niches.length === 0) && !customPrompt) {
    return NextResponse.json({ error: "Selecione pelo menos um nicho ou insira um prompt." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });
  const results = [];
  const clampedQty = Math.min(Math.max(1, quantity), 20);

  for (let i = 0; i < clampedQty; i++) {
    const niche = niches && niches.length > 0 ? niches[i % niches.length] : "personalizado";
    const nicheData = NICHE_DATA[niche] || { label: "Personalizado", prompts: [] };
    
    let imagePrompt = "";
    if (customPrompt) {
      imagePrompt = customPrompt;
    } else {
      const promptPool = nicheData.prompts;
      imagePrompt = promptPool[Math.floor(Math.random() * promptPool.length)];
    }

    try {
      // 1. Generate image
      const imageResponse = await ai.models.generateContent({
        model: "models/gemini-2.0-flash",
        contents: imagePrompt,
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      let imageBase64: string | null = null;
      let mimeType = "image/png";

      for (const part of imageResponse.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
          imageBase64 = part.inlineData.data ?? null;
          mimeType = part.inlineData.mimeType ?? "image/png";
          break;
        }
      }

      // 2. Generate Adobe Stock metadata
      const metaPrompt = `You are an expert Adobe Stock contributor. 
For an image described as: "${imagePrompt}"
Niche: ${nicheData.label}

Generate Adobe Stock submission metadata. Return ONLY valid JSON, no markdown, no extra text:
{
  "title": "Commercial title under 70 characters. Descriptive, no artist names, no real people, no brand names",
  "description": "SEO-optimized description under 200 characters. Describe what buyers see and the use case",
  "keywords": "45 to 50 relevant commercial keywords separated by commas. Start with most important. No artist names, no brand names, no real person names",
  "category": "Primary Adobe Stock category (e.g: Nature, Business, People, Food, Architecture, Animals, Health, Travel, Abstract, Fashion, Sports)"
}`;

      const metaResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: metaPrompt,
      });

      let metadata = {
        title: `Stock image - ${nicheData.label} ${i + 1}`,
        description: imagePrompt.slice(0, 200),
        keywords: "",
        category: nicheData.label,
      };

      try {
        const rawText = metaResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
        const cleaned = rawText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        metadata = { ...metadata, ...parsed };
      } catch {
        // keep defaults
      }

      results.push({
        id: i + 1,
        niche,
        nicheLabel: nicheData.label,
        prompt: imagePrompt,
        imageBase64: imageBase64 ? `data:${mimeType};base64,${imageBase64}` : null,
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        category: metadata.category,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      results.push({
        id: i + 1,
        niche,
        nicheLabel: nicheData.label,
        prompt: imagePrompt,
        imageBase64: null,
        title: "",
        description: "",
        keywords: "",
        category: "",
        error: message,
      });
    }

    // Rate limit delay between images (free tier: ~2 RPM for image gen)
    if (i < clampedQty - 1) {
      await sleep(4000);
    }
  }

  return NextResponse.json({ results });
}
