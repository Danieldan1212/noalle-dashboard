---
name: noalle-analytics
description: Unified analytics for Noalle Jewelry. Pull data from Shopify, Instagram, Facebook, and Pinterest into one report. Use when checking business performance, social media stats, or customer insights.
origin: custom
---

# Noalle Analytics - Unified Business Intelligence

One command to see everything about Noalle Jewelry's business performance.

## When to Activate

- User asks about sales, revenue, or business performance
- User asks about social media analytics or engagement
- User says "analytics", "report", "stats", "דוח", "נתונים", or "אנליטיקס"
- User wants to understand what's working and what isn't

## Usage

```
/noalle-analytics                  # Full weekly report
/noalle-analytics today            # Quick daily snapshot
/noalle-analytics social           # Social media only
/noalle-analytics sales            # Shopify sales only
/noalle-analytics month            # Monthly overview
```

## Data Sources

### 1. Shopify (via Admin API)

Pull these metrics using the Shopify Admin REST API:

```
GET /admin/api/2024-01/orders.json?status=any&created_at_min={date}
GET /admin/api/2024-01/customers.json
GET /admin/api/2024-01/products.json
```

**Metrics to extract:**
- Total revenue (₪) for period
- Number of orders
- Average order value (AOV)
- Top 5 selling products
- New vs returning customers
- Cart abandonment rate (if available)
- Geographic breakdown (Israel vs international)
- Revenue trend (compare to previous period)

### 2. Instagram (via Meta Graph API)

```
GET /{ig-user-id}/insights?metric=impressions,reach,profile_views,follower_count
GET /{ig-user-id}/media?fields=id,caption,media_type,timestamp,like_count,comments_count
```

**Metrics:**
- Follower count + growth rate
- Post engagement rate (likes + comments / followers)
- Reach and impressions
- Top 5 performing posts (by engagement)
- Best posting time analysis
- Story views (if applicable)
- Saves and shares per post

### 3. Facebook (via Meta Graph API)

```
GET /{page-id}/insights?metric=page_impressions,page_engaged_users,page_fan_adds
GET /{page-id}/posts?fields=message,created_time,shares,reactions.summary(true),comments.summary(true)
```

**Metrics:**
- Page likes + growth
- Post reach and engagement
- Top performing posts
- Audience demographics

### 4. Pinterest (via Pinterest API)

```
GET /user_account/analytics?start_date={date}&end_date={date}
GET /pins?fields=id,title,description,created_at,pin_metrics
```

**Metrics:**
- Pin impressions and clicks
- Click-through rate
- Top performing pins
- Board performance
- Audience interests

## Report Formats

### Daily Snapshot (quick terminal output)

```
╔══════════════════════════════════════════════╗
║  📊 דוח יומי - Noalle Jewelry               ║
║  תאריך: {date}                               ║
╠══════════════════════════════════════════════╣
║                                              ║
║  💰 מכירות                                   ║
║  הזמנות היום: 3 | הכנסה: ₪2,450              ║
║  ממוצע הזמנה: ₪816                           ║
║                                              ║
║  📱 רשתות חברתיות                             ║
║  Instagram: 45 לייקים, 12 תגובות              ║
║  Facebook: 23 הגעה, 8 שיתופים                ║
║  Pinterest: 156 הצגות, 12 קליקים             ║
║                                              ║
║  🔥 הפוסט המוביל                              ║
║  "טבעת הזהב עם הספיר..." - 89 לייקים         ║
║                                              ║
║  ⚠️ דורש תשומת לב                            ║
║  3 לקוחות ממתינים למעקב                       ║
╚══════════════════════════════════════════════╝
```

### Weekly Report (HTML file opened in browser)

Generate an HTML file at `./reports/weekly-{date}.html` with:

1. **Executive Summary** - 3-4 bullet points in Hebrew, biggest wins and concerns
2. **Sales Dashboard** - Revenue chart (7 days), top products, AOV trend
3. **Social Performance** - Engagement by platform, follower growth, top posts with images
4. **Cross-Platform Insights** - Which social posts drove website visits/sales
5. **Action Items** - AI-generated recommendations in Hebrew

Use Chart.js for charts (load from CDN in the HTML file).

### Monthly Overview

Same as weekly but with:
- Month-over-month comparison
- Customer lifetime value trends
- Seasonal patterns
- ROI per platform

## Insights Engine

After pulling data, use Claude API to generate Hebrew insights:

**Prompt:**
```
You are a business analyst for Noalle Jewelry, an Israeli jewelry brand.
Analyze these metrics and provide 3-5 actionable insights in Hebrew.

{metrics_json}

Focus on:
1. What's working well (celebrate wins)
2. What needs attention (flag concerns)
3. Specific actions to take this week
4. Patterns or trends

Keep it practical and actionable. The owner is not technical.
```

## Caching

Store snapshots in the AnalyticsSnapshot model to:
- Avoid hitting API rate limits
- Enable historical comparison
- Build trend data over time

Cache refresh: daily for social metrics, hourly for Shopify sales.

## Error Handling

- If any API is unavailable: report which source failed, show data from available sources
- If API keys not configured: list which keys are missing and link to setup guide
- Rate limit hit: use cached data, note the timestamp
- No data for period: show message "אין נתונים לתקופה זו" (No data for this period)
