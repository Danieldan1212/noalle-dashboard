---
name: study-buddy
description: University study assistant for Economics, Business, Management, and Accounting. Interactive quizzing, exam-to-homework generator, study summaries, and concept explanations in Hebrew. Use when studying, preparing for exams, or generating practice questions.
origin: custom
---

# Study Buddy - University Study Assistant

All-in-one study tool for Israeli university students. Quizzing, homework generation from past exams, concept explanations, and study summaries - all in Hebrew.

## When to Activate

- User wants to study, practice, or prepare for an exam
- User says "quiz", "study", "explain", "homework", "תרגול", "למידה", "הסבר", or "שיעורי בית"
- User uploads an exam PDF or lecture notes
- User asks about a concept from their courses

## Usage

```
/study-buddy quiz "מיקרו-כלכלה" --topic "עלות שולית"
/study-buddy explain "עקומת הביקוש"
/study-buddy summarize lecture-3.pdf
/study-buddy generate-hw exam-2024.pdf exam-2023.pdf exam-2022.pdf
/study-buddy flashcards "חשבונאות" --topic "מאזן"
```

## Commands

### 1. Quiz Mode (`quiz`)

Interactive one-question-at-a-time quizzing.

**Flow:**
1. User selects course and optionally a topic
2. AI generates questions based on:
   - Previously uploaded materials for that course
   - Known exam patterns (if past exams uploaded)
   - Adaptive difficulty based on user's track record
3. Present question in Hebrew with 4 options (for multiple choice) or open-ended
4. User answers
5. Show feedback:
   - ✅ נכון! (Correct!) - brief reinforcement
   - ❌ לא נכון (Incorrect) - full explanation of correct answer in Hebrew
   - Why the wrong answer is wrong
   - Related concept to review
6. After 10 questions (or user stops), show session summary:
   - Score: X/10
   - Weak topics identified
   - Recommendations for review

**Claude API prompt for question generation:**
```
You are a university professor creating exam questions for Israeli students.
Course: {course_name}
Topic: {topic} (optional)
Difficulty: {1-5}
Language: Hebrew (עברית)

Generate a question in the style of Israeli university exams.
For multiple choice: provide 4 options where distractors are plausible.
For open-ended: provide the model answer.

Include:
- questionHe: the question text in Hebrew
- optionsHe: array of 4 options (for MC) or null (for open)
- answerHe: correct answer
- explanationHe: detailed explanation in Hebrew, using Israeli real-world examples
- difficulty: 1-5
- relatedTopics: array of related topics to review if wrong
```

### 2. Concept Explainer (`explain`)

Type any concept → get a clear Hebrew explanation.

**Claude API prompt:**
```
You are explaining the concept "{concept}" to an Israeli university student
studying {course}. Explain in Hebrew (עברית).

Requirements:
1. Start with a one-sentence definition
2. Explain the concept simply (as if to a friend over coffee)
3. Give 2-3 real-world examples from Israeli context:
   - Use Israeli companies (Teva, Wix, Check Point)
   - Use shekel (₪) for monetary examples
   - Reference Israeli market dynamics
4. Show the mathematical formula if applicable (use LaTeX notation)
5. Explain common misconceptions
6. Connect to related concepts they should know
7. End with "מבחן מהיר" (Quick test) - one question to check understanding
```

### 3. Study Summary Generator (`summarize`)

Upload lecture notes, textbook chapters, or slides → get condensed study sheets.

**Input:** PDF, DOCX, or images of notes
**Process:**
1. Parse document (use pdf-parse for PDFs)
2. Extract key content
3. Send to Claude API for summarization

**Claude API prompt:**
```
You are creating a condensed study sheet from these lecture notes/materials.
Course: {course}
Language: Hebrew (עברית)

Create a study sheet that includes:
1. 📋 נקודות מפתח (Key Points) - 5-10 bullet points
2. 📐 נוסחאות (Formulas) - all formulas with variable definitions
3. 📖 הגדרות (Definitions) - key terms and their definitions
4. 🔗 קשרים (Connections) - how this topic connects to others in the course
5. ⚡ טיפים למבחן (Exam Tips) - what's likely to be tested

Format for easy reading and printing. Use Hebrew headings.
```

**Output:** Formatted study sheet displayed in terminal OR saved as HTML file.

### 4. Exam-to-Homework Generator (`generate-hw`)

Upload past exams → AI generates new practice questions in the same style.

**Flow:**
1. Accept multiple PDF files (past exams)
2. Parse each exam, extract all questions
3. Analyze patterns:
   - Topic distribution (what % per topic)
   - Question types (MC, open, calculation, graph analysis)
   - Difficulty progression over years
   - Common tricks and traps
4. Generate a NEW exam/homework set that:
   - Matches the topic distribution
   - Uses the same question types
   - Includes similar difficulty
   - Avoids repeating exact questions
   - Adds new twists on recurring patterns

**Claude API prompt:**
```
You are a university professor creating a practice exam.
Here are {n} past exams from the course "{course}":

{parsed_exam_content}

Analysis:
- Topics covered: {topic_distribution}
- Question types: {type_distribution}
- Average difficulty: {avg_difficulty}

Generate a new practice exam that:
1. Follows the same structure and format
2. Matches the topic distribution
3. Uses similar question types
4. Has comparable difficulty
5. Tests the same concepts from different angles
6. Includes a full answer key with explanations

Output in Hebrew. Format as a clean, printable exam document.
Number questions. Include point values matching the original format.
```

**Output options:**
- Display in terminal
- Save as HTML (for printing)
- Save as formatted text file

### 5. Flashcard Mode (`flashcards`)

Generate study flashcards from course materials.

**Flow:**
1. Extract key terms and concepts from uploaded materials
2. Create term ↔ definition pairs in Hebrew
3. Display one at a time:
   - Show term → user thinks of definition → flip to reveal
   - Track which cards user marks as "ידעתי" (knew) vs "לחזור" (review)
4. Spaced repetition: show difficult cards more often

### 6. Exam Scraper (`scrape`)

Automatically download past exams from university portal.

**Flow:**
1. User provides portal URL and credentials
2. Use Playwright or Puppeteer to:
   - Log into the university portal
   - Navigate to the course's exam archive
   - Download all available past exams as PDFs
3. Save to local directory organized by course and year
4. Auto-process downloaded exams (parse and index)

**Note:** This requires the user to be logged in. We navigate the portal on their behalf, not bypassing any authentication.

## Course Presets

Pre-configured topics for common Israeli university courses:

### מיקרו-כלכלה (Microeconomics)
Topics: ביקוש והיצע, גמישות, עלויות ייצור, שוק תחרותי, מונופול, אוליגופול, תועלת שולית, כשל שוק, מיסוי

### מאקרו-כלכלה (Macroeconomics)
Topics: תמ"ג, אינפלציה, אבטלה, מדיניות פיסקלית, מדיניות מוניטרית, מאזן תשלומים, שער חליפין, צמיחה כלכלית

### חשבונאות פיננסית (Financial Accounting)
Topics: מאזן, דוח רווח והפסד, תזרים מזומנים, רישום כפול, פחת, מלאי, הכנסות והוצאות, יחסים פיננסיים

### מנהל עסקים (Business Management)
Topics: תכנון אסטרטגי, מבנה ארגוני, מנהיגות, שיווק, משאבי אנוש, ניהול פרויקטים, קבלת החלטות

### סטטיסטיקה עסקית (Business Statistics)
Topics: הסתברות, התפלגות נורמלית, מבחני השערות, רגרסיה, מתאם, דגימה, רווחי סמך

## Progress Tracking

Track in the Study Buddy database:
- Questions asked per topic
- Correct/incorrect ratio per topic
- Mastery level per topic (0-100%)
- Time spent studying per course
- Quiz session history
- Weak areas needing review

## Output Language

ALL output is in Hebrew (עברית) by default.
Mathematical notation uses standard international symbols.
Variable names in formulas keep their English letters (Q, P, MC, etc.) as that's how they appear in Israeli textbooks.

## Error Handling

- PDF parsing fails: ask user to try photos instead, or paste text directly
- No materials uploaded yet: offer to quiz on general course topics from presets
- Claude API error: retry once, then inform user
- Scraper blocked: guide user to download manually
