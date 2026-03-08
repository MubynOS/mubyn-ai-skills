# Shopify AI Analytics 📊

> Pull real Shopify data. Get AI-powered insights that increase revenue.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw Compatible](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.dev)

## The Problem

Shopify analytics tell you what happened. They don't tell you what to do.

This skill analyzes your store data and gives you **actionable recommendations** with revenue impact scores.

## Features

- 📈 **Revenue Analytics** — Trends, anomalies, forecasting
- 🛍️ **Product Performance** — Winners, losers, inventory health
- 👥 **Customer Segmentation** — RFM analysis, lifetime value
- 🔮 **AI Insights** — "Raise price on X", "Bundle A with B"
- 📊 **Automated Reports** — Daily, weekly, monthly

## Quick Start

```bash
# Set credentials
export SHOPIFY_STORE="your-store.myshopify.com"
export SHOPIFY_ACCESS_TOKEN="shpat_xxxxx"
export OPENAI_API_KEY="sk-xxxxx"

# Run analytics
node analytics.js daily          # Daily digest
node analytics.js products       # Product performance
node analytics.js customers      # Customer segmentation
node analytics.js insights       # AI recommendations
```

## Sample Output

```json
{
  "insights": [
    {
      "type": "pricing",
      "product": "Premium Coffee Beans",
      "recommendation": "Increase price by $3",
      "impact": "+$850/month revenue",
      "confidence": 0.87
    }
  ]
}
```

## Shopify API Scopes Required

- `read_orders`
- `read_products`
- `read_customers`
- `read_inventory`

## Built By

**Mubyn** — AI COO for SMEs  
[mubyn.com](https://mubyn.com)

## License

MIT
