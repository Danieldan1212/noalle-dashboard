# 📋 דף פקודות - Noalle Jewelry + Study Buddy
# Command Cheatsheet

---

## 🛍️ Noalle Jewelry - פקודות עסקיות

### פרסום ברשתות חברתיות
```
/noalle-post photo.jpg "תיאור התכשיט"
```
📸 מעלה תמונה → משפר אותה → יוצר כיתוב → מפרסם

**דוגמאות:**
```
/noalle-post ring.jpg "טבעת זהב עם ספיר כחול"
/noalle-post necklace.png "שרשרת כסף עם תליון יהלום"
/noalle-post bracelet.jpg "צמיד פנינים טבעיות"
```

### אנליטיקס ודוחות
```
/noalle-analytics              # דוח שבועי מלא
/noalle-analytics today        # סיכום יומי מהיר
/noalle-analytics social       # רשתות חברתיות בלבד
/noalle-analytics sales        # מכירות בלבד
```
📊 מושך נתונים מ-Shopify + Instagram + Facebook + Pinterest

### תיקון עברית באתר
```
/fix-hebrew audit              # בדיקה בלבד
/fix-hebrew fix                # תיקון אוטומטי
```
🔧 מתקן בעיות RTL ועברית בחנות Shopify

---

## 📖 Study Buddy - פקודות לימוד

### תרגול (Quiz)
```
/study-buddy quiz "מיקרו-כלכלה"
/study-buddy quiz "חשבונאות" --topic "מאזן"
```
❓ שואל שאלות אחת אחת, נותן משוב מיידי בעברית

### הסבר מושג
```
/study-buddy explain "עלות שולית"
/study-buddy explain "עקומת הביקוש"
/study-buddy explain "מאזן תשלומים"
```
💡 מסביר בעברית פשוטה עם דוגמאות ישראליות

### סיכום חומר
```
/study-buddy summarize lecture.pdf
/study-buddy summarize chapter3.pdf
```
📝 יוצר דף סיכום מרוכז עם נקודות מפתח ונוסחאות

### יצירת שיעורי בית ממבחנים
```
/study-buddy generate-hw exam2024.pdf exam2023.pdf exam2022.pdf
```
📄 מנתח מבחנים ישנים ויוצר שאלות תרגול חדשות באותו סגנון

### כרטיסיות (Flashcards)
```
/study-buddy flashcards "חשבונאות" --topic "יחסים פיננסיים"
```
🃏 כרטיסיות עם מונח ↔ הגדרה

---

## 🎨 כלים נוספים

### מותג (Brand)
```
/brand audit                   # בדיקת זהות מותגית
/brand voice                   # הגדרת קול המותג
```

### עיצוב
```
/design social instagram       # עיצוב פוסט לאינסטגרם
/banner-design facebook-cover  # עיצוב קאבר לפייסבוק
```

### מחקר
```
/deep-research "תחרות בשוק התכשיטים בישראל"
/deep-research "טרנדים בתכשיטים 2026"
```

---

## 💡 טיפים

1. **תמיד אפשר לכתוב בעברית** - Claude מבין עברית מצוין
2. **אל תפחד לטעות** - אפשר לנסות שוב
3. **שאל שאלות** - תכתוב "מה אתה יכול לעשות?" ותקבל תשובה
4. **שמור תמונות בתיקייה אחת** - יותר קל לנהל

---

## 🆘 עזרה

אם משהו לא עובד:
1. בדוק שה-API Keys מוגדרים ב-.env.local
2. בדוק שהשרת רץ (npm run dev)
3. שלח הודעה לדניאל 😊
