---
name: noalle-post
description: Photo-to-post pipeline for Noalle Jewelry. Upload a jewelry photo → AI enhancement → Hebrew/English captions → hashtags → post to Instagram, Facebook, Pinterest. Use when creating social media content.
origin: custom
---

# Noalle Post - Photo to Social Media Pipeline

Take a jewelry photo and turn it into a ready-to-publish social media post across all platforms.

## When to Activate

- User wants to create a social media post from a photo
- User says "post", "publish", "share", or "פרסם"
- User uploads or references a jewelry photo
- User wants to create content for Instagram, Facebook, or Pinterest

## Usage

```
/noalle-post <photo-path> "<description>"
/noalle-post ring.jpg "טבעת זהב עם ספיר כחול"
/noalle-post necklace.png "gold chain with diamond pendant"
```

## Pipeline (Execute in Order)

### Step 1: Analyze the Photo

Read the uploaded photo. Determine:
- Product type (ring, necklace, bracelet, earrings, etc.)
- Style (classic, modern, bohemian, luxury, minimalist)
- Materials visible (gold, silver, gemstones, pearls)
- Shot type (product/white background vs lifestyle/styled)

### Step 2: Enhance with fal.ai

Use the `/fal-ai-media` skill for image enhancement:

**For product shots:**
- Background removal → clean white background
- Lighting correction → even, professional lighting
- Sharpness enhancement → crisp detail on gems/metalwork

**For lifestyle shots:**
- Color enhancement → warm, inviting tones
- Depth of field → subtle background blur
- Lighting → golden hour warmth

Call fal.ai API:
```typescript
// Background removal
POST https://fal.run/fal-ai/birefnet
{ image_url: "<base64 or URL>" }

// Image enhancement
POST https://fal.run/fal-ai/clarity-upscaler
{ image_url: "<URL>", scale: 2 }
```

Show before/after comparison to user.

### Step 3: Generate Captions

Use Claude API to generate captions with Noalle's brand voice.

**Prompt template:**
```
You are the social media voice for Noalle Jewelry, an Israeli jewelry brand.
Brand voice: elegant, warm, personal, artisanal. Mix of Hebrew and English.

Product: {description}
Type: {product_type}
Style: {style}

Generate:
1. Hebrew caption (2-3 sentences, emotional, personal story about the piece)
2. English caption (same tone, not direct translation)
3. Hebrew hashtags (10, mix of brand + category + trending)
4. English hashtags (10, same mix)

Format the caption with line breaks for readability.
Include a call-to-action (link in bio, DM to order, etc.)
```

### Step 4: Adapt for Platforms

Create platform-specific versions:

**Instagram (1080x1080 square):**
- Full Hebrew caption
- 20 hashtags (first comment)
- Mention @noallejewelry

**Facebook (1200x630 landscape):**
- Shorter caption
- 3-5 hashtags only
- Include link to product page if available

**Pinterest (1000x1500 portrait):**
- Title: product name + key feature
- Description: SEO-optimized, keyword-rich
- Board suggestion based on product type
- Link to Shopify product page

### Step 5: Preview and Copy

Display all three versions side-by-side with:
- Platform name
- Image (cropped to platform dimensions)
- Caption text
- Hashtags

Then provide ready-to-copy output:

```
📋 כיתוב בעברית:
{hebrew caption}

{hebrew hashtags}

---

📋 English Caption:
{english caption}

{english hashtags}
```

Ask user: "העתקתי ללוח. פתח את Meta Business Suite לפרסום?" (Copied to clipboard. Open Meta Business Suite to post?)

Options:
1. 📋 העתק כיתוב בעברית (Copy Hebrew caption) → copies to clipboard
2. 📋 העתק כיתוב באנגלית (Copy English caption) → copies to clipboard
3. ✏️ ערוך כיתוב (Edit caption) → re-display
4. 💾 שמור טיוטה (Save draft to dashboard)

### Step 6: Post via Meta Business Suite / Pinterest

The user posts manually through:
- **Instagram + Facebook** → Meta Business Suite (free, business.facebook.com)
- **Pinterest** → Pinterest Business (free, business.pinterest.com)

**Why not direct posting?** Meta and Pinterest change their APIs frequently. Using their native tools means posting never breaks. Our skill focuses on what no other tool can do: Hebrew captions + photo enhancement.

Save the draft to the Noalle Dashboard database (SocialPost model) for tracking.

## Brand Voice Reference

Load brand identity from the project's CLAUDE.md or brand.ts file.

**Tone keywords:** אלגנטי, חם, אישי, אומנותי (elegant, warm, personal, artisanal)

**Caption patterns:**
- Start with emotion or story, not product specs
- Mention the craft/making process when relevant
- End with gentle CTA
- Use emojis sparingly (✨💎🌟 only)

## Error Handling

- If no photo provided: ask user to provide one
- If fal.ai fails: skip enhancement, use original photo
- If caption generation fails: provide template for manual fill
- If posting fails: save as draft, report error
