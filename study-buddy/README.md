# Study Buddy - חבר ללימודים

כלי לימוד חכם לסטודנטים ישראלים, מבוסס על בינה מלאכותית (Claude AI).
מתאים לקורסים בכלכלה, מנהל עסקים, חשבונאות וניהול.

A smart study tool for Israeli university students, powered by Claude AI.
Designed for Economics, Business, Management, and Accounting courses.

---

## תכונות | Features

- **תרגול חכם** - שאלות אמריקאיות מותאמות אישית עם הסבר מפורט
- **סדנת מבחנים** - ניתוח מבחנים קודמים ויצירת מבחני תרגול חדשים
- **דפי סיכום** - יצירת סיכומים תמציתיים מחומרי לימוד
- **הסבר מושגים** - חיפוש כל מושג וקבלת הסבר בעברית עם דוגמאות ישראליות
- **כרטיסיות לימוד** - Flashcards לחזרה על מושגי מפתח
- **מעקב התקדמות** - גרפים, מפות חום ונתונים סטטיסטיים
- **מצב סימולציה** - מבחני תרגול עם טיימר כמו במבחן אמיתי

---

## התקנה | Setup

### דרישות מקדימות | Prerequisites

- Node.js 18+
- npm / pnpm / yarn

### שלבים | Steps

```bash
# Clone or navigate to the project
cd study-buddy

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# Generate Prisma client and create database
npx prisma generate
npx prisma db push

# Start development server (port 3008)
npm run dev
```

הפרויקט ירוץ על http://localhost:3008

---

## מבנה הפרויקט | Project Structure

```
study-buddy/
├── prisma/              # Database schema (SQLite)
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes
│   │   ├── courses/     # Course management
│   │   ├── quiz/        # Quiz/practice
│   │   ├── workshop/    # Exam workshop
│   │   ├── materials/   # Study materials
│   │   └── progress/    # Progress tracking
│   ├── components/      # React components
│   │   ├── quiz/        # Quiz components
│   │   ├── materials/   # Material components
│   │   ├── workshop/    # Workshop components
│   │   └── ui/          # Shared UI components
│   └── lib/             # Utilities
│       ├── ai.ts        # Claude API wrapper
│       ├── db.ts        # Prisma client
│       ├── pdf.ts       # PDF parser
│       ├── scraper.ts   # University portal scraper
│       └── utils.ts     # Shared utilities
└── uploads/             # Uploaded files
```

---

## טכנולוגיות | Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Prisma + SQLite
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic SDK)
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF**: pdf-parse

---

## הגדרות סביבה | Environment Variables

| משתנה | תיאור |
|-------|-------|
| `ANTHROPIC_API_KEY` | מפתח API של Anthropic (Claude) |
| `DATABASE_URL` | כתובת מסד הנתונים (ברירת מחדל: SQLite מקומי) |

---

## רישיון | License

Private - For educational use only.
