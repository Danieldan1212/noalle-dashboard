import pdf from "pdf-parse";
import { readFile } from "fs/promises";
import { join } from "path";

export async function parsePdfFromPath(filePath: string): Promise<string> {
  const absolutePath = filePath.startsWith("/")
    ? filePath
    : join(process.cwd(), filePath);

  const dataBuffer = await readFile(absolutePath);
  const data = await pdf(dataBuffer);

  return data.text;
}

export async function parsePdfFromBuffer(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

export function extractExamMetadata(text: string): {
  year: number | null;
  semester: string | null;
  courseName: string | null;
} {
  let year: number | null = null;
  let semester: string | null = null;
  let courseName: string | null = null;

  // Try to find year (Hebrew academic years or standard)
  const yearMatch = text.match(
    /(?:תש[א-ת]"[א-ת]|20[0-9]{2}|סמסטר [אב]'?\s*20[0-9]{2})/
  );
  if (yearMatch) {
    const digitMatch = yearMatch[0].match(/20[0-9]{2}/);
    if (digitMatch) {
      year = parseInt(digitMatch[0], 10);
    }
  }

  // Try to find semester
  if (text.includes("סמסטר א") || text.includes("סמסטר א'")) {
    semester = "א";
  } else if (text.includes("סמסטר ב") || text.includes("סמסטר ב'")) {
    semester = "ב";
  } else if (text.includes("קיץ") || text.includes("סמסטר קיץ")) {
    semester = "קיץ";
  }

  // Try to extract course name (common patterns in Israeli university exams)
  const courseMatch = text.match(
    /(?:שם הקורס|קורס|מקצוע)[:\s]*([^\n]+)/
  );
  if (courseMatch) {
    courseName = courseMatch[1].trim();
  }

  return { year, semester, courseName };
}
