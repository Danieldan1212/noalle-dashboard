import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create courses
  const economics = await prisma.course.create({
    data: {
      name: "Introduction to Microeconomics",
      nameHe: "מבוא למיקרו-כלכלה",
      semester: "ב 2026",
      examDate: new Date("2026-07-15"),
    },
  });

  const accounting = await prisma.course.create({
    data: {
      name: "Financial Accounting",
      nameHe: "חשבונאות פיננסית",
      semester: "ב 2026",
      examDate: new Date("2026-07-20"),
    },
  });

  const management = await prisma.course.create({
    data: {
      name: "Principles of Management",
      nameHe: "עקרונות הניהול",
      semester: "ב 2026",
      examDate: new Date("2026-07-25"),
    },
  });

  const businessAdmin = await prisma.course.create({
    data: {
      name: "Business Administration",
      nameHe: "מנהל עסקים",
      semester: "ב 2026",
      examDate: new Date("2026-07-10"),
    },
  });

  // Create topics for each course
  const econTopics = [
    { name: "Supply and Demand", nameHe: "היצע וביקוש", mastery: 0.72 },
    { name: "Elasticity", nameHe: "גמישות", mastery: 0.45 },
    { name: "Market Equilibrium", nameHe: "שיווי משקל בשוק", mastery: 0.63 },
    { name: "Consumer Theory", nameHe: "תורת הצרכן", mastery: 0.38 },
    { name: "Production Costs", nameHe: "עלויות ייצור", mastery: 0.55 },
    { name: "Market Structures", nameHe: "מבני שוק", mastery: 0.29 },
  ];

  for (const topic of econTopics) {
    const t = await prisma.topic.create({
      data: {
        courseId: economics.id,
        name: topic.name,
        nameHe: topic.nameHe,
        mastery: topic.mastery,
      },
    });

    // Add sample questions for each topic
    await prisma.question.create({
      data: {
        topicId: t.id,
        source: "seed",
        questionHe: `מהו ${topic.nameHe} בהקשר של מיקרו-כלכלה?`,
        optionsHe: JSON.stringify([
          `הגדרה נכונה של ${topic.nameHe}`,
          `הגדרה שגויה א של ${topic.nameHe}`,
          `הגדרה שגויה ב של ${topic.nameHe}`,
          `הגדרה שגויה ג של ${topic.nameHe}`,
        ]),
        answerHe: `הגדרה נכונה של ${topic.nameHe}`,
        explanationHe: `${topic.nameHe} הוא מושג יסוד במיקרו-כלכלה. ההגדרה הנכונה מתארת את המושג בצורה מדויקת.`,
        difficulty: 2,
      },
    });
  }

  const accountingTopics = [
    { name: "Balance Sheet", nameHe: "מאזן", mastery: 0.61 },
    { name: "Income Statement", nameHe: "דוח רווח והפסד", mastery: 0.53 },
    { name: "Journal Entries", nameHe: "פקודות יומן", mastery: 0.42 },
    { name: "Depreciation", nameHe: "פחת", mastery: 0.35 },
    { name: "Inventory", nameHe: "מלאי", mastery: 0.48 },
  ];

  for (const topic of accountingTopics) {
    await prisma.topic.create({
      data: {
        courseId: accounting.id,
        name: topic.name,
        nameHe: topic.nameHe,
        mastery: topic.mastery,
      },
    });
  }

  const managementTopics = [
    { name: "Planning", nameHe: "תכנון", mastery: 0.58 },
    { name: "Organizing", nameHe: "ארגון", mastery: 0.67 },
    { name: "Leading", nameHe: "הנהגה", mastery: 0.44 },
    { name: "Controlling", nameHe: "בקרה", mastery: 0.52 },
  ];

  for (const topic of managementTopics) {
    await prisma.topic.create({
      data: {
        courseId: management.id,
        name: topic.name,
        nameHe: topic.nameHe,
        mastery: topic.mastery,
      },
    });
  }

  const businessTopics = [
    { name: "Marketing", nameHe: "שיווק", mastery: 0.71 },
    { name: "Finance", nameHe: "מימון", mastery: 0.39 },
    { name: "Strategy", nameHe: "אסטרטגיה", mastery: 0.56 },
    { name: "Operations", nameHe: "תפעול", mastery: 0.63 },
    { name: "HR", nameHe: "משאבי אנוש", mastery: 0.47 },
  ];

  for (const topic of businessTopics) {
    await prisma.topic.create({
      data: {
        courseId: businessAdmin.id,
        name: topic.name,
        nameHe: topic.nameHe,
        mastery: topic.mastery,
      },
    });
  }

  // Create sample quiz sessions
  const quizData = [
    { courseId: economics.id, score: 65, totalQs: 10, correctQs: 6, duration: 480, daysAgo: 14 },
    { courseId: economics.id, score: 72, totalQs: 10, correctQs: 7, duration: 420, daysAgo: 10 },
    { courseId: economics.id, score: 78, totalQs: 15, correctQs: 12, duration: 600, daysAgo: 7 },
    { courseId: economics.id, score: 85, totalQs: 10, correctQs: 8, duration: 360, daysAgo: 3 },
    { courseId: accounting.id, score: 55, totalQs: 10, correctQs: 5, duration: 540, daysAgo: 12 },
    { courseId: accounting.id, score: 62, totalQs: 10, correctQs: 6, duration: 480, daysAgo: 8 },
    { courseId: accounting.id, score: 70, totalQs: 15, correctQs: 10, duration: 720, daysAgo: 4 },
    { courseId: management.id, score: 80, totalQs: 10, correctQs: 8, duration: 300, daysAgo: 5 },
    { courseId: businessAdmin.id, score: 68, totalQs: 10, correctQs: 7, duration: 450, daysAgo: 6 },
  ];

  for (const quiz of quizData) {
    const date = new Date();
    date.setDate(date.getDate() - quiz.daysAgo);

    await prisma.quizSession.create({
      data: {
        courseId: quiz.courseId,
        score: quiz.score,
        totalQs: quiz.totalQs,
        correctQs: quiz.correctQs,
        duration: quiz.duration,
        answers: "[]",
        createdAt: date,
      },
    });
  }

  console.log("Seeding complete!");
  console.log(`Created ${4} courses with topics and sample data.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
