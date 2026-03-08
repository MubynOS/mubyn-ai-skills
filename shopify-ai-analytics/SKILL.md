---
name: shopify-ai-analytics
description: |
  Shopify store analytics with AI-powered insights. Revenue tracking. Product performance.
  Customer segmentation. Trend detection. Actionable recommendations.
  Pull real data from Shopify API. Generate insights that drive sales.
  Triggers: shopify analytics, store analytics, ecommerce analytics, revenue tracking,
  product performance, customer insights, shopify ai, sales analytics, ecommerce ai
tags: [shopify, analytics, ecommerce, revenue, insights, ai, reporting]
author: mubyn
version: 1.0.0
license: MIT
---

# Shopify AI Analytics 📊

> **Real data. Real insights.** Pull from Shopify API. Get AI-powered recommendations that actually increase revenue.

## The Problem

Shopify's built-in analytics are:
- ❌ Backward-looking (what happened, not what to do)
- ❌ Surface-level (no deep customer insights)
- ❌ Action-less (numbers without recommendations)
- ❌ Siloed (no cross-metric correlations)

You need an AI analyst that:
- ✅ Tells you WHAT to do, not just what happened
- ✅ Identifies patterns humans miss
- ✅ Prioritizes by revenue impact
- ✅ Speaks in plain language

---

## What You Get

```
┌────────────────────────────────────────────────────────────────────┐
│                    SHOPIFY AI ANALYTICS                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  📈 REVENUE                       🛍️ PRODUCTS                      │
│  ─────────────                   ─────────────                     │
│  • Daily/weekly/monthly          • Top performers                  │
│  • Trend detection               • Underperformers                 │
│  • Anomaly alerts                • Inventory health                │
│  • Forecasting                   • Pricing optimization            │
│                                                                    │
│  👥 CUSTOMERS                     🔮 AI INSIGHTS                    │
│  ─────────────                   ─────────────                     │
│  • RFM segmentation              • "Bundle X with Y"               │
│  • Cohort analysis               • "Raise price on Z"              │
│  • Lifetime value                • "Email segment A"               │
│  • Churn prediction              • "Stock up on B"                 │
│                                                                    │
│  📊 REPORTS                       ⚡ ACTIONS                        │
│  ─────────────                   ─────────────                     │
│  • Daily digest                  • Priority queue                  │
│  • Weekly summary                • Revenue impact score            │
│  • Monthly deep-dive             • One-click implementation        │
│  • Custom reports                • Success tracking                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Setup

```bash
# Set your Shopify credentials
export SHOPIFY_STORE="your-store.myshopify.com"
export SHOPIFY_ACCESS_TOKEN="shpat_xxxxx"
export OPENAI_API_KEY="sk-xxxxx"
```

### 2. Generate Analytics Report

```bash
# Daily digest
node analytics.js daily

# Weekly deep-dive
node analytics.js weekly

# Product performance
node analytics.js products --top 20

# Customer segmentation
node analytics.js customers --segment rfm

# AI recommendations
node analytics.js insights
```

### 3. Output

```json
{
  "period": "2026-03-01 to 2026-03-08",
  "revenue": {
    "total": 47250,
    "trend": "+12.5% vs last week",
    "anomalies": []
  },
  "insights": [
    {
      "type": "pricing",
      "product": "Organic Coffee Beans 1kg",
      "recommendation": "Increase price by $3 (still below competitors)",
      "impact": "+$850/month revenue",
      "confidence": 0.87
    },
    {
      "type": "bundle",
      "products": ["Coffee Beans", "Coffee Grinder"],
      "recommendation": "Create bundle at $89 (15% discount)",
      "impact": "+$1,200/month revenue",
      "confidence": 0.82
    }
  ]
}
```

---

## Features

### Revenue Analytics

```javascript
// Get revenue breakdown
const revenue = await analytics.getRevenue({
  period: 'last_30_days',
  breakdown: ['daily', 'product', 'channel'],
  compare: 'previous_period'
});

// Output
{
  total: 142500,
  average_order: 85.50,
  orders: 1667,
  trend: '+8.3%',
  best_day: { date: '2026-03-15', revenue: 8750, reason: 'Flash sale' },
  worst_day: { date: '2026-03-11', revenue: 2100, reason: 'Monday slump' },
  by_channel: {
    online_store: 95000,
    pos: 32500,
    draft_orders: 15000
  }
}
```

### Product Performance

```javascript
// Analyze products
const products = await analytics.getProductPerformance({
  period: 'last_30_days',
  metrics: ['revenue', 'units', 'margin', 'velocity'],
  segment: 'top_20'
});

// Output
{
  top_performers: [
    { title: 'Premium Beans', revenue: 15000, units: 500, margin: '45%', velocity: 'fast' },
    { title: 'Gift Set', revenue: 12000, units: 150, margin: '52%', velocity: 'medium' }
  ],
  underperformers: [
    { title: 'Decaf Blend', revenue: 800, units: 40, margin: '38%', recommendation: 'Consider bundling or discontinuing' }
  ],
  inventory_alerts: [
    { title: 'Premium Beans', days_until_stockout: 12, recommendation: 'Reorder now' }
  ]
}
```

### Customer Segmentation (RFM)

```javascript
// RFM Analysis
const segments = await analytics.getCustomerSegments({
  method: 'rfm',
  period: 'last_90_days'
});

// Output
{
  segments: {
    champions: { count: 245, revenue: 52000, avg_order: 125, actions: ['VIP treatment', 'Early access'] },
    loyal: { count: 890, revenue: 71200, avg_order: 80, actions: ['Loyalty rewards', 'Referral program'] },
    promising: { count: 1200, revenue: 48000, avg_order: 40, actions: ['Upsell', 'Second purchase incentive'] },
    at_risk: { count: 450, revenue: 0, avg_order: 0, actions: ['Win-back campaign', 'Special offer'] },
    lost: { count: 2100, revenue: 0, avg_order: 0, actions: ['Reactivation email', 'Survey'] }
  },
  lifetime_value: {
    average: 285,
    top_10_percent: 1250,
    median: 120
  }
}
```

### AI-Powered Insights

```javascript
// Get AI recommendations
const insights = await analytics.getAIInsights({
  focus: ['pricing', 'inventory', 'marketing', 'products'],
  min_confidence: 0.75,
  min_impact: 500 // $500/month minimum impact
});

// Output
{
  insights: [
    {
      id: 'ins_001',
      type: 'pricing',
      title: 'Price optimization opportunity',
      description: 'Premium Beans is priced 15% below competitors with high demand',
      recommendation: 'Increase price from $29.99 to $34.99',
      impact: { monthly_revenue: 2500, confidence: 0.89 },
      action: { type: 'price_update', product_id: 123, new_price: 34.99 }
    },
    {
      id: 'ins_002',
      type: 'inventory',
      title: 'Stock alert',
      description: 'Gift Set will stock out in 8 days based on current velocity',
      recommendation: 'Reorder 200 units immediately',
      impact: { prevented_lost_sales: 4000, confidence: 0.92 },
      action: { type: 'purchase_order', product_id: 456, quantity: 200 }
    },
    {
      id: 'ins_003',
      type: 'marketing',
      title: 'At-risk customer segment',
      description: '450 customers haven\'t purchased in 60+ days',
      recommendation: 'Launch win-back email campaign with 15% discount',
      impact: { recovered_revenue: 3200, confidence: 0.71 },
      action: { type: 'email_campaign', segment: 'at_risk', offer: '15%' }
    }
  ],
  total_potential_impact: 9700
}
```

---

## Report Types

### Daily Digest

Quick morning summary:
- Yesterday's revenue vs target
- Orders and AOV
- Top 5 products
- Any anomalies
- Top 3 actions

### Weekly Summary

End-of-week deep-dive:
- Week-over-week comparison
- Product performance analysis
- Customer acquisition/retention
- Channel breakdown
- 5-10 prioritized recommendations

### Monthly Report

Strategic monthly review:
- Month-over-month trends
- Customer lifetime value update
- Cohort analysis
- Inventory health
- Competitive positioning (if data available)
- Strategic recommendations

---

## API Reference

### Initialize

```javascript
const ShopifyAnalytics = require('./analytics');

const analytics = new ShopifyAnalytics({
  store: 'your-store.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  openaiKey: process.env.OPENAI_API_KEY
});
```

### Methods

| Method | Description |
|--------|-------------|
| `getRevenue(options)` | Revenue breakdown and trends |
| `getProductPerformance(options)` | Product-level analytics |
| `getCustomerSegments(options)` | RFM and cohort analysis |
| `getInventoryHealth()` | Stock levels and forecasts |
| `getAIInsights(options)` | AI-powered recommendations |
| `generateReport(type)` | Daily/weekly/monthly reports |
| `trackAction(insightId, result)` | Track recommendation outcomes |

---

## Configuration

```yaml
# config.yaml
shopify:
  store: your-store.myshopify.com
  api_version: "2024-01"

analytics:
  default_period: last_30_days
  comparison_period: previous_period
  currency: USD

insights:
  min_confidence: 0.70
  min_impact: 100  # Minimum $100/month impact
  categories:
    - pricing
    - inventory
    - marketing
    - products
    - customers

reports:
  daily:
    time: "08:00"
    channel: email  # or slack, telegram
  weekly:
    day: monday
    time: "09:00"
```

---

## Shopify API Scopes Required

```
read_orders
read_products
read_customers
read_inventory
read_analytics
read_reports
```

---

## Output Formats

### JSON (default)
Full structured data for programmatic use.

### Markdown
Human-readable reports for sharing.

### Slack/Email
Formatted for direct sending.

### CSV
For spreadsheet analysis.

---

## Requirements

- Node.js 18+
- Shopify store with API access
- OpenAI API key (for AI insights)
- At least 30 days of order data (for meaningful insights)

---

## Files Included

```
shopify-ai-analytics/
├── SKILL.md              # This file
├── README.md             # GitHub readme
├── analytics.js          # Main CLI & library
├── lib/
│   ├── shopify-client.js # Shopify API wrapper
│   ├── revenue.js        # Revenue analytics
│   ├── products.js       # Product analytics
│   ├── customers.js      # Customer segmentation
│   ├── inventory.js      # Inventory health
│   ├── insights.js       # AI recommendations
│   └── reports.js        # Report generation
├── config/
│   └── config-example.yaml
└── examples/
    ├── sample-daily-report.md
    ├── sample-weekly-report.md
    └── sample-insights.json
```

---

## Example Daily Report

```markdown
# ☕ Daily Analytics Report
**Store:** Your Coffee Shop
**Date:** March 8, 2026

## 📊 Yesterday at a Glance

| Metric | Value | vs Last Week |
|--------|-------|--------------|
| Revenue | $4,750 | +12% ↑ |
| Orders | 58 | +8% ↑ |
| AOV | $81.90 | +4% ↑ |
| Conversion | 3.2% | +0.3% ↑ |

## 🏆 Top Products

1. Premium Beans 1kg — $1,250 (26%)
2. Gift Set — $890 (19%)
3. Subscription Box — $650 (14%)

## ⚡ Actions

1. **🔴 HIGH** Stock alert: Premium Beans (8 days until stockout)
2. **🟡 MEDIUM** 45 customers in win-back segment — send email?
3. **🟢 LOW** Consider price test on Gift Set (+$5)

---
*Generated by Shopify AI Analytics*
```

---

## Pricing

**Free version includes:**
- Daily revenue metrics
- Top 10 products
- Basic customer count
- JSON export

**Premium ($79) adds:**
- Full product analytics
- RFM customer segmentation
- AI-powered insights
- Automated reports (daily/weekly)
- Slack/Email integration
- Inventory forecasting
- Priority support

→ Get Premium: mubyn.com/skills/shopify-ai-analytics

---

*Turn your Shopify data into revenue. Let AI be your analyst.* 📊
