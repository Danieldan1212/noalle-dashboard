import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: process.env.FAL_KEY || "",
});

interface EnhanceResult {
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type: string;
  }>;
}

export async function enhanceImage(imageUrl: string): Promise<string> {
  const result = await fal.subscribe("fal-ai/creative-upscaler", {
    input: {
      image_url: imageUrl,
      scale: 2,
      creativity: 0.3,
      detail: 1,
      shape_preservation: 0.75,
    },
    logs: true,
  });

  const enhanceResult = result as unknown as EnhanceResult;
  if (enhanceResult.images && enhanceResult.images.length > 0) {
    return enhanceResult.images[0].url;
  }

  throw new Error("No enhanced image returned from fal.ai");
}

export async function removeBackground(imageUrl: string): Promise<string> {
  const result = await fal.subscribe("fal-ai/birefnet", {
    input: {
      image_url: imageUrl,
    },
    logs: true,
  });

  const bgResult = result as unknown as EnhanceResult;
  if (bgResult.images && bgResult.images.length > 0) {
    return bgResult.images[0].url;
  }

  throw new Error("No result returned from background removal");
}

export async function improvedLighting(imageUrl: string): Promise<string> {
  const result = await fal.subscribe("fal-ai/creative-upscaler", {
    input: {
      image_url: imageUrl,
      scale: 1,
      creativity: 0.5,
      detail: 1.2,
      shape_preservation: 0.9,
      prompt:
        "professional jewelry photography, perfect lighting, elegant product shot",
      negative_prompt: "blurry, dark, low quality, amateur",
    },
    logs: true,
  });

  const lightResult = result as unknown as EnhanceResult;
  if (lightResult.images && lightResult.images.length > 0) {
    return lightResult.images[0].url;
  }

  throw new Error("No result returned from lighting improvement");
}

export const falClient = {
  enhanceImage,
  removeBackground,
  improvedLighting,
};
