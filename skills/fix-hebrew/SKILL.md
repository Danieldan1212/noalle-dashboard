---
name: fix-hebrew
description: Audit and fix Hebrew RTL issues AND mobile UX on Shopify themes. Diagnoses broken right-to-left text, mirrored layouts, bidirectional text problems, and mobile usability issues. Use when Hebrew content looks broken or mobile experience is poor on a Shopify site.
origin: custom
---

# Fix Hebrew - Shopify RTL Audit & Repair + Mobile UX

Diagnose and fix Hebrew/RTL rendering issues AND mobile user experience on Shopify stores.

> **CRITICAL: MOBILE-FIRST.** Most Israeli jewelry shoppers browse on their phones. Every fix must be verified on mobile viewport (375px) BEFORE desktop. If it looks great on desktop but breaks on mobile, it's not fixed.

## When to Activate

- User reports Hebrew text looking broken on their Shopify site
- User says "fix hebrew", "RTL", "עברית", or "תיקון עברית"
- User mentions text alignment, mirrored layout, or bidirectional text issues
- Before launching a Hebrew version of a Shopify store

## Usage

```
/fix-hebrew <shopify-theme-directory>
/fix-hebrew ./themes/dawn
/fix-hebrew audit     # Audit only, don't fix
/fix-hebrew fix       # Apply all fixes
```

## Phase 1: Audit

### Download Theme
If not already local, use Shopify CLI:
```bash
shopify theme pull --store=noallejewelry.myshopify.com
```

### Scan for RTL Issues

Check ALL `.liquid`, `.css`, `.scss`, and `.js` files for:

#### CSS Issues (Most Common)
1. **Missing `direction: rtl`** on body/html
2. **Hardcoded `left`/`right`** instead of logical properties
   - `margin-left` → should be `margin-inline-start`
   - `padding-right` → should be `padding-inline-end`
   - `text-align: left` → should be `text-align: start`
   - `float: left` → should be `float: inline-start`
   - `left: 0` → should be `inset-inline-start: 0`
3. **Hardcoded `ltr` direction** in CSS or inline styles
4. **Flexbox/Grid without logical ordering** 
   - `flex-direction: row` is fine (auto-reverses in RTL)
   - But `order` values may need adjustment
5. **Absolute positioning** using left/right instead of inset-inline
6. **Border radius** using physical corners instead of logical
   - `border-top-left-radius` → `border-start-start-radius`
7. **Background position** using left/right keywords
8. **Transform translate** with hardcoded X values (may need negation in RTL)

#### Liquid Template Issues
1. **Missing `dir="rtl"` attribute** on `<html>` tag
2. **Missing `lang="he"` attribute**
3. **Inline styles with hardcoded direction**
4. **Form inputs without `dir="auto"`** (important for mixed content)
5. **Navigation order** not adapting to RTL

#### JavaScript Issues
1. **Scroll behavior** using left/right calculations
2. **Carousel/slider** direction not reversing
3. **Dropdown menus** opening in wrong direction
4. **Animation** translateX values not negated

#### Content Issues
1. **Number formatting** (phone numbers, prices) displaying incorrectly
2. **Mixed Hebrew/English text** without proper `bdi` or `dir="auto"` wrapping
3. **Icons** that imply direction (arrows) not mirroring
4. **Date formatting** (Hebrew dates read right-to-left)

### Generate Audit Report

Output a categorized report:

```
╔══════════════════════════════════════════════╗
║  🔍 בדיקת RTL - Noalle Jewelry              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  🔴 קריטי (Critical) - 5 issues             ║
║  ├─ base.css:42 - missing dir="rtl"         ║
║  ├─ header.liquid:15 - hardcoded left       ║
║  ├─ nav.liquid:8 - menu order reversed      ║
║  ├─ product.css:156 - text-align: left      ║
║  └─ footer.liquid:23 - inline margin-left   ║
║                                              ║
║  🟡 חשוב (Important) - 12 issues            ║
║  ├─ ... (list each)                         ║
║                                              ║
║  🟢 קל (Minor) - 8 issues                   ║
║  ├─ ... (list each)                         ║
║                                              ║
║  סה"כ: 25 בעיות | 5 קריטיות                  ║
╚══════════════════════════════════════════════╝
```

## Phase 2: Fix

### Automated Fixes

Apply these transformations automatically:

#### 1. Add RTL Foundation
In `theme.liquid` or `layout/theme.liquid`:
```html
<!-- Before -->
<html>
<!-- After -->
<html dir="rtl" lang="he">
```

#### 2. CSS Logical Properties
Create or modify a `rtl-overrides.css` file:
```css
/* RTL Logical Property Overrides */
[dir="rtl"] {
  /* Base direction */
  direction: rtl;
  text-align: right;
}

/* Convert common physical → logical properties */
/* Auto-generated from audit findings */
```

Use search-and-replace for simple cases:
- `margin-left:` → `margin-inline-start:`
- `margin-right:` → `margin-inline-end:`
- `padding-left:` → `padding-inline-start:`
- `padding-right:` → `padding-inline-end:`
- `text-align: left` → `text-align: start`
- `text-align: right` → `text-align: end`
- `float: left` → `float: inline-start`
- `float: right` → `float: inline-end`

#### 3. Form Inputs
Add `dir="auto"` to all input and textarea elements:
```html
<input type="text" dir="auto" />
<textarea dir="auto"></textarea>
```

#### 4. Mixed Content Wrapping
Wrap English text within Hebrew context:
```html
<bdi>English brand name</bdi>
```

#### 5. Number Formatting
Ensure prices display correctly:
```html
<span dir="ltr">₪1,234.00</span>
```

### Manual Review Required

Flag these for human review (don't auto-fix):
- Carousel/slider direction changes (may break JS)
- Complex animation adjustments
- Custom JavaScript scroll handlers
- Third-party widget positioning

## Phase 3: Mobile UX Audit & Fix (CRITICAL)

> Most Noalle Jewelry customers browse on mobile. This phase is NOT optional.

### Mobile-Specific Issues to Scan

#### Touch & Interaction
1. **Touch targets too small** - All tappable elements must be minimum 44x44px (Apple HIG) / 48x48dp (Material)
   - Buttons, links, nav items, filter toggles, variant selectors
   - Product image thumbnails in gallery
   - Cart quantity +/- buttons
   - "Add to Cart" must be LARGE and thumb-reachable
2. **No sticky "Add to Cart"** - On product pages, the buy button should stick to bottom of viewport on scroll
3. **Pinch-to-zoom blocked** - Jewelry NEEDS zoom. Ensure `user-scalable=yes` in viewport meta, or provide a tap-to-zoom image gallery
4. **Swipe not enabled** - Product image galleries must support swipe gestures
5. **Form inputs too small** - Checkout inputs need min 16px font (prevents iOS auto-zoom)

#### Layout & Spacing
6. **Horizontal overflow** - Elements breaking out of viewport width (common RTL bug)
   - Test at 375px (iPhone SE), 390px (iPhone 14), 412px (Samsung Galaxy)
7. **Text too small** - Body text minimum 16px on mobile, product titles minimum 18px
8. **Images not responsive** - Product images must scale properly, not crop awkwardly
9. **Product grid too dense** - On mobile, product cards should be 1-2 columns max, not 3-4
10. **Padding/margins too tight** - Content shouldn't touch screen edges (min 16px side padding)
11. **Footer bloat** - Footer shouldn't be 5 screens long on mobile. Collapse into accordions.

#### Navigation
12. **Hamburger menu not RTL** - Mobile menu must open from the RIGHT side (not left) for Hebrew users
13. **Menu items too close together** - Each nav item needs 48px minimum height
14. **No sticky header** - Header should stick on scroll so navigation is always accessible
15. **Search hidden** - Search should be prominent, not buried in hamburger menu
16. **Back-to-top missing** - Long product listing pages need a back-to-top button

#### Jewelry-Specific Mobile UX
17. **Product images too small** - Jewelry detail matters! Hero image should be LARGE on mobile (min 90vw)
18. **No image zoom** - Must have tap-to-zoom or pinch-to-zoom for seeing gem detail, engravings, clasps
19. **Product info below fold** - Price + "Add to Cart" must be visible without scrolling on product page
20. **Variant selector (size/color) hard to tap** - Use large pill buttons, not tiny dropdowns
21. **WhatsApp button missing** - Israeli customers expect a WhatsApp chat button (floating, bottom-right in RTL)
22. **Instagram feed not showing** - Consider embedding recent Instagram posts on homepage (social proof)

#### Performance (Mobile Networks)
23. **Images not optimized** - Use WebP/AVIF, lazy loading, srcset for responsive sizes
24. **Too many fonts loaded** - Load only Heebo weights actually used (400, 500, 700 max)
25. **Render-blocking resources** - CSS/JS blocking first paint
26. **No skeleton/loading states** - Show shimmer placeholders while content loads
27. **Total page weight** - Product listing page should be under 2MB on initial load

### Mobile Fixes to Apply

#### Viewport & Base
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

#### Sticky Add-to-Cart (Product Page)
```css
@media (max-width: 768px) {
  .product-form__submit {
    position: sticky;
    bottom: 0;
    z-index: 100;
    width: 100%;
    padding: 16px;
    background: var(--color-background);
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    border-radius: 0;
    font-size: 18px;
    min-height: 56px;
  }
}
```

#### Mobile Product Grid
```css
@media (max-width: 768px) {
  .collection-product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 16px;
  }
  
  .product-card__title {
    font-size: 14px;
    line-height: 1.3;
  }
  
  .product-card__price {
    font-size: 16px;
    font-weight: 700;
  }
}

@media (max-width: 375px) {
  .collection-product-grid {
    grid-template-columns: 1fr;
  }
}
```

#### Touch Target Minimums
```css
@media (max-width: 768px) {
  a, button, [role="button"], input[type="submit"], 
  .nav-link, .filter-option, .variant-selector {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 16px;
  }
  
  input, textarea, select {
    font-size: 16px; /* Prevents iOS zoom */
    min-height: 48px;
    padding: 12px;
  }
}
```

#### RTL Mobile Menu (Opens from Right)
```css
[dir="rtl"] .mobile-nav {
  right: 0;
  left: auto;
  transform: translateX(100%); /* Slides in from right */
}

[dir="rtl"] .mobile-nav.is-open {
  transform: translateX(0);
}
```

#### WhatsApp Floating Button
```html
<a href="https://wa.me/972XXXXXXXXX?text=שלום, אשמח לשאול לגבי תכשיט" 
   class="whatsapp-float" 
   target="_blank" 
   aria-label="WhatsApp">
  <svg><!-- WhatsApp icon --></svg>
</a>
```
```css
.whatsapp-float {
  position: fixed;
  bottom: 80px; /* Above sticky add-to-cart */
  right: 20px; /* RTL: right side */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 99;
}
```

#### Lazy Loading + Responsive Images
```html
<img 
  srcset="product-400.webp 400w, product-800.webp 800w, product-1200.webp 1200w"
  sizes="(max-width: 768px) 90vw, 45vw"
  src="product-800.webp"
  alt="טבעת זהב עם ספיר"
  loading="lazy"
  decoding="async"
/>
```

## Phase 4: Verify

### RTL Checklist
- [ ] Homepage renders correctly in RTL
- [ ] Navigation menu items are right-aligned
- [ ] Product cards layout mirrors properly
- [ ] Product page text is right-aligned
- [ ] Cart/checkout forms work in RTL
- [ ] Footer links are right-aligned
- [ ] Search bar text input is right-aligned
- [ ] Price displays correctly (₪ on correct side)
- [ ] Mixed Hebrew/English text is readable
- [ ] Phone numbers display correctly

### Mobile Checklist (TEST ON REAL PHONE)
- [ ] **Homepage** loads fast, no horizontal scroll
- [ ] **Navigation** opens from right, items are tappable
- [ ] **Product grid** shows 2 columns, images are clear
- [ ] **Product page** - image is large, zoomable, swipeable
- [ ] **Add to Cart** button is sticky at bottom, large and obvious
- [ ] **Price + variants** visible without scrolling
- [ ] **Checkout** inputs are 16px+, no iOS zoom, easy to fill on phone
- [ ] **WhatsApp button** visible and works
- [ ] **All touch targets** are 44px+ minimum
- [ ] **Page speed** under 3 seconds on 4G (test with Lighthouse mobile)
- [ ] **No horizontal overflow** at 375px viewport
- [ ] **Images** load progressively, not all at once

### Test Devices
Test on these viewport widths minimum:
- 375px (iPhone SE / small phones)
- 390px (iPhone 14)
- 412px (Samsung Galaxy S series)
- 768px (iPad / tablet, if relevant)

### Upload Fixed Theme
```bash
shopify theme push --store=noallejewelry.myshopify.com
```

## Bilingual Toggle

If the store needs both Hebrew and English:

### Option A: Shopify Markets (Recommended)
Use Shopify's built-in Markets feature:
- Settings → Markets → Add market (Israel/Hebrew)
- Shopify handles language switching and URL routing
- Theme automatically gets `dir` attribute based on locale

### Option B: Manual Toggle
Add a language switcher in the header:
```liquid
<div class="language-toggle">
  <a href="?lang=he" {% if request.locale == 'he' %}class="active"{% endif %}>עברית</a>
  <a href="?lang=en" {% if request.locale == 'en' %}class="active"{% endif %}>English</a>
</div>
```

## Re-Audit

After theme updates or new features, re-run:
```
/fix-hebrew audit
```

This catches any new RTL AND mobile issues introduced by theme updates.

## Mobile UX Quick Wins (Do These First)

Priority order for maximum impact with minimum effort:
1. **Sticky Add-to-Cart** - biggest conversion lift on mobile
2. **WhatsApp button** - Israeli customers expect it
3. **Image zoom on product pages** - jewelry needs detail
4. **Touch target sizes** - stop frustrating fat-finger taps
5. **Mobile menu from right** - feels natural in Hebrew
6. **16px form inputs** - no more iOS zoom on checkout
7. **Responsive product grid** - 2 columns on phone
8. **Lazy load images** - faster page load on cellular
