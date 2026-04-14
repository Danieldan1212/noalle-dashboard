import Anthropic from "@anthropic-ai/sdk";
import { BRAND } from "./brand";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const BRAND_CONTEXT = `
אתה כותב תוכן עבור ${BRAND.nameHe} (${BRAND.name}).
סגנון המותג: ${BRAND.voice.toneHe}
קהל היעד: ${BRAND.voice.audienceHe}
מילות מפתח: ${BRAND.voice.keywords.join(", ")}
האשטגים של המותג: ${BRAND.hashtags.hebrew.join(" ")}

חוקים חשובים:
- כל הטקסטים בעברית צריכים להיות בעברית תקנית ואלגנטית
- התאם את הסגנון לפלטפורמה (אינסטגרם = קצר ומושך, פייסבוק = יותר מפורט, פינטרסט = תיאורי ומעורר השראה)
- השתמש באמוג׳ים בצורה מתונה ואלגנטית
- הכלל תמיד קריאה לפעולה
`;

export interface CaptionResult {
  captionHe: string;
  captionEn: string;
  hashtags: string[];
  hashtagsEn: string[];
}

export async function generateCaption(params: {
  imageDescription?: string;
  productType?: string;
  occasion?: string;
  platform: "instagram" | "facebook" | "pinterest" | "all";
  tone?: string;
}): Promise<CaptionResult> {
  const platformGuidance: Record<string, string> = {
    instagram: "כתוב קפשן קצר ומושך לאינסטגרם (עד 150 מילים), עם אמוג׳ים מתונים",
    facebook: "כתוב פוסט לפייסבוק (עד 200 מילים), יותר מפורט ואישי",
    pinterest: "כתוב תיאור לפינטרסט (עד 100 מילים), מעורר השראה ותיאורי",
    all: "כתוב קפשן שמתאים לכל הפלטפורמות (עד 150 מילים)",
  };

  const prompt = `${platformGuidance[params.platform]}

פרטי הפוסט:
${params.imageDescription ? `תיאור התמונה: ${params.imageDescription}` : ""}
${params.productType ? `סוג המוצר: ${params.productType}` : "תכשיט"}
${params.occasion ? `אירוע/הזדמנות: ${params.occasion}` : ""}
${params.tone ? `טון: ${params.tone}` : ""}

אנא החזר את התוצאה בפורמט JSON הבא בלבד (ללא טקסט נוסף):
{
  "captionHe": "הקפשן בעברית",
  "captionEn": "The caption in English",
  "hashtags": ["#האשטג1", "#האשטג2"],
  "hashtagsEn": ["#hashtag1", "#hashtag2"]
}

כלול 5-8 האשטגים בכל שפה. שלב האשטגים של המותג עם האשטגים הרלוונטיים.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: BRAND_CONTEXT,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  try {
    const parsed = JSON.parse(content.text) as CaptionResult;
    return parsed;
  } catch {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as CaptionResult;
    }
    throw new Error("Failed to parse caption response");
  }
}

export async function generateInsights(params: {
  salesData?: string;
  socialData?: string;
  period?: string;
}): Promise<string> {
  const prompt = `נתח את הנתונים הבאים ותן תובנות עסקיות ב3-5 נקודות בעברית:

${params.salesData ? `נתוני מכירות:\n${params.salesData}` : ""}
${params.socialData ? `נתוני רשתות חברתיות:\n${params.socialData}` : ""}
${params.period ? `תקופה: ${params.period}` : ""}

התמקד ב:
1. מגמות עיקריות
2. הזדמנויות לצמיחה
3. המלצות לפעולה

החזר בפורמט JSON:
{
  "insights": [
    { "title": "כותרת", "description": "תיאור", "type": "trend|opportunity|action", "priority": "high|medium|low" }
  ]
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: BRAND_CONTEXT,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  return content.text;
}

export const aiClient = {
  generateCaption,
  generateInsights,
};
