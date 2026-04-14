# Noalle Jewelry - Claude Code Configuration

## User Profile
- **Name:** [Friend's name]
- **Role:** Owner of Noalle Jewelry
- **Technical Level:** Non-technical - keep explanations simple, use Hebrew when possible
- **Language:** Hebrew primary (עברית), English secondary

## Projects

### Noalle Business Dashboard
- **Path:** ~/noalle-dashboard
- **Port:** 3007
- **Stack:** Next.js 15, Prisma + SQLite, Tailwind, shadcn/ui
- **Purpose:** CRM + Social Media Manager + Analytics

### Study Buddy
- **Path:** ~/study-buddy
- **Port:** 3008
- **Stack:** Next.js 15, Prisma + SQLite, Tailwind, shadcn/ui
- **Purpose:** University study tools (Econ, Business, Management, Accounting)

## Brand Identity - Noalle Jewelry

### Colors
- Primary: #b8860b (deep gold)
- Secondary: #2d2d2d (rich charcoal)
- Accent: #e8b4b8 (soft rose)
- Background: #fdf8f0 (warm cream)
- Surface: #ffffff (white)

### Typography
- Hebrew: Heebo (Google Fonts)
- English: [TBD from brand audit]

### Brand Voice
- **Tone:** אלגנטי, חם, אישי, אומנותי (elegant, warm, personal, artisanal)
- **Language:** Hebrew primary, bilingual captions for social media
- **Emojis:** Sparingly - ✨💎🌟 only
- **Style:** Start with emotion/story, not specs. Mention craft process. Gentle CTA.

### Social Media
- **Instagram:** @noallejewelry [update with actual handle]
- **Facebook:** [update with page URL]
- **Pinterest:** [update with profile URL]

## API Keys (stored in .env.local, NOT here)

Required keys:
- ANTHROPIC_API_KEY
- FAL_AI_KEY
- SHOPIFY_STORE_URL
- SHOPIFY_ACCESS_TOKEN
- META_ACCESS_TOKEN
- META_INSTAGRAM_ID
- META_PAGE_ID
- PINTEREST_ACCESS_TOKEN

## Default Behavior

1. **Language:** Always respond in Hebrew unless asked otherwise
2. **Complexity:** Keep technical explanations simple
3. **Social Posts:** Always generate Hebrew caption + English caption + hashtags in both
4. **Analytics:** Display in Hebrew with ₪ for currency
5. **Study Materials:** All in Hebrew, formulas use standard notation

## University Courses
- מיקרו-כלכלה (Microeconomics)
- מאקרו-כלכלה (Macroeconomics)
- חשבונאות פיננסית (Financial Accounting)
- מנהל עסקים (Business Management)
- סטטיסטיקה עסקית (Business Statistics)

## Port Registry
| App | Port |
|-----|------|
| Noalle Dashboard | 3007 |
| Study Buddy | 3008 |

## Rules
- Never expose API keys in code or output
- Always back up Shopify theme before making changes
- Social media posts require user approval before publishing
- Study materials should use Israeli real-world examples
- All UI must be RTL (dir="rtl", lang="he")
