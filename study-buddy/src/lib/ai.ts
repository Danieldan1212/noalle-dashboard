import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT_HE = `אתה עוזר לימודי מומחה לסטודנטים ישראלים. אתה מתמחה בכלכלה, מנהל עסקים, חשבונאות וניהול.
כל התשובות שלך חייבות להיות בעברית.
השתמש בדוגמאות מהשוק הישראלי כשרלוונטי (בורסת תל אביב, בנק ישראל, חברות ישראליות כמו טבע, אלביט, בנק הפועלים וכו').
הסבר מושגים בצורה ברורה ופשוטה, עם דוגמאות מעשיות.`;

export interface GeneratedQuestion {
  questionHe: string;
  optionsHe: string[];
  answerHe: string;
  explanationHe: string;
  difficulty: number;
}

export async function generateQuestionsFromContent(
  content: string,
  topicName: string,
  count: number = 5,
  difficulty: number = 2
): Promise<GeneratedQuestion[]> {
  const difficultyLabel =
    difficulty === 1 ? "קל" : difficulty === 2 ? "בינוני" : "קשה";

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT_HE,
    messages: [
      {
        role: "user",
        content: `בהתבסס על החומר הבא, צור ${count} שאלות אמריקאיות (רב-ברירה) ברמת קושי ${difficultyLabel} בנושא "${topicName}".

החומר:
${content.substring(0, 8000)}

החזר את התשובה בפורמט JSON בלבד, ללא טקסט נוסף:
[
  {
    "questionHe": "טקסט השאלה",
    "optionsHe": ["תשובה א", "תשובה ב", "תשובה ג", "תשובה ד"],
    "answerHe": "התשובה הנכונה (אותו טקסט כמו באחת האפשרויות)",
    "explanationHe": "הסבר מפורט למה זו התשובה הנכונה",
    "difficulty": ${difficulty}
  }
]`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse AI response as JSON array");
  }

  const questions: GeneratedQuestion[] = JSON.parse(jsonMatch[0]);
  return questions;
}

export async function generateStudySummary(
  content: string,
  courseName: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT_HE,
    messages: [
      {
        role: "user",
        content: `צור דף סיכום תמציתי וממוקד לקורס "${courseName}" בהתבסס על החומר הבא.

הדף צריך לכלול:
1. נקודות מפתח (בולטים)
2. נוסחאות חשובות (אם רלוונטי)
3. מושגי מפתח והגדרותיהם
4. טיפים למבחן
5. קשרים בין נושאים

החומר:
${content.substring(0, 12000)}

כתוב בעברית, בפורמט ברור וקריא עם כותרות וסימני bullet.`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  return textBlock.text;
}

export async function explainConcept(
  concept: string,
  courseContext?: string
): Promise<string> {
  const contextNote = courseContext
    ? ` בהקשר של הקורס "${courseContext}"`
    : "";

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT_HE,
    messages: [
      {
        role: "user",
        content: `הסבר את המושג "${concept}"${contextNote}.

כלול:
1. הגדרה ברורה ופשוטה
2. דוגמה מעשית מהשוק הישראלי
3. למה זה חשוב
4. קשר למושגים אחרים
5. טיפ לזכירה

כתוב בעברית בשפה ברורה ונגישה.`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  return textBlock.text;
}

export async function analyzeExam(
  content: string
): Promise<{
  topics: { name: string; frequency: number; difficulty: number }[];
  patterns: string[];
  recommendations: string[];
}> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT_HE,
    messages: [
      {
        role: "user",
        content: `נתח את המבחן הבא וזהה:
1. נושאים עיקריים ותדירות ההופעה שלהם (1-10)
2. רמת קושי ממוצעת לכל נושא (1-3)
3. דפוסים חוזרים בשאלות
4. המלצות ללימוד

המבחן:
${content.substring(0, 12000)}

החזר בפורמט JSON:
{
  "topics": [{"name": "שם הנושא", "frequency": 5, "difficulty": 2}],
  "patterns": ["דפוס 1", "דפוס 2"],
  "recommendations": ["המלצה 1", "המלצה 2"]
}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse AI response");
  }

  return JSON.parse(jsonMatch[0]);
}

export async function generatePracticeExam(
  content: string,
  courseName: string,
  questionCount: number = 20
): Promise<GeneratedQuestion[]> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: SYSTEM_PROMPT_HE,
    messages: [
      {
        role: "user",
        content: `בהתבסס על המבחנים הקודמים בקורס "${courseName}", צור מבחן תרגול חדש עם ${questionCount} שאלות.

המבחן צריך:
- לכסות את כל הנושאים העיקריים
- לכלול שאלות ברמות קושי שונות
- להיות דומה בסגנון למבחנים הקודמים
- לכלול שאלות חישוב ושאלות תיאורטיות

חומר מהמבחנים הקודמים:
${content.substring(0, 12000)}

החזר בפורמט JSON (מערך של שאלות):
[
  {
    "questionHe": "טקסט השאלה",
    "optionsHe": ["א", "ב", "ג", "ד"],
    "answerHe": "התשובה הנכונה",
    "explanationHe": "הסבר",
    "difficulty": 2
  }
]`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse AI response");
  }

  return JSON.parse(jsonMatch[0]);
}
