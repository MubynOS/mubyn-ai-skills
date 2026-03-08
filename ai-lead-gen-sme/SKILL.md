---
name: ai-lead-gen-sme
description: |
  AI-powered lead generation for SMEs. Apollo People Search + Google Maps + email validation.
  MX record verification. Lead scoring. Campaign assignment. Multi-source enrichment.
  Proven: generated 1,481 verified leads in production.
  Triggers: lead generation, find leads, prospect research, apollo leads, google maps leads,
  email validation, b2b leads, sales prospecting, lead enrichment, sme leads, business leads
tags: [leads, sales, apollo, google-maps, email-validation, b2b, prospecting, sme]
author: mubyn
version: 1.0.0
license: MIT
---

# AI Lead Gen SME 🎯

> **Battle-tested.** Generated 1,481 verified leads in production. MX validation reduces bounce rate from 22% to under 3%.

## The Problem

SMEs waste hours on lead generation:
- Manual Google searches
- Copy-pasting into spreadsheets
- 22% email bounce rates (bad data)
- No scoring or prioritization
- Paying $300+/month for Apollo/ZoomInfo full plans

This skill automates the entire pipeline. Find → Validate → Score → Assign.

---

## What You Get

```
┌──────────────────────────────────────────────────────────────────┐
│                      LEAD GENERATION PIPELINE                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📍 SOURCE                🔍 ENRICH               ✅ VALIDATE     │
│  ─────────────           ─────────────           ─────────────   │
│  • Apollo People         • Email finder          • Syntax check  │
│  • Apollo Orgs           • Phone lookup          • MX records    │
│  • Google Maps           • Company data          • Blacklist     │
│  • Custom CSV            • LinkedIn URL          • DNS verify    │
│                          • Revenue/size                           │
│                                                                   │
│                              ⬇                                    │
│                                                                   │
│  📊 SCORE                 📁 ASSIGN               📤 EXPORT       │
│  ─────────────           ─────────────           ─────────────   │
│  • ICP match (0-100)     • Hot/Warm/Cold         • JSON/CSV      │
│  • Intent signals        • Campaign buckets      • CRM-ready     │
│  • Company fit           • Follow-up dates       • Email drafts  │
│  • Timing score          • Priority queue                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Environment Setup

```bash
# Required API keys (in .env or environment)
export APOLLO_API_KEY="your_apollo_key"
export GOOGLE_MAPS_API_KEY="your_google_maps_key"
export HUNTER_API_KEY="your_hunter_key"  # Optional, for extra email verification
```

### Generate Leads

```bash
# Search Apollo for people
node lead-gen.js search --source apollo --query "CEO" --industry "restaurant" --location "Dubai" --limit 50

# Search Google Maps for businesses
node lead-gen.js search --source maps --query "restaurants in Dubai" --limit 100

# Search Apollo organizations
node lead-gen.js search --source apollo-orgs --industry "hospitality" --location "UAE" --limit 25

# Import from CSV and enrich
node lead-gen.js enrich --input leads.csv --output enriched.json
```

### Validate Emails

```bash
# Validate a single email
node lead-gen.js validate --email "test@example.com"

# Batch validate from file
node lead-gen.js validate --input leads.json --output validated.json

# With MX record check (slower but more accurate)
node lead-gen.js validate --input leads.json --mx-check --output validated.json
```

### Score and Assign

```bash
# Score leads against your ICP
node lead-gen.js score --input validated.json --icp-config icp.yaml --output scored.json

# Auto-assign to campaigns
node lead-gen.js assign --input scored.json --campaigns campaigns.yaml --output assigned.json
```

---

## Email Validation (The Secret Sauce)

Our validation reduces bounce rates from 22% to under 3%:

### Three-Layer Validation

```javascript
// Layer 1: Syntax Check (instant)
validateEmail("test@example.com")  // true/false

// Layer 2: MX Record Check (2-3 seconds)
validateEmailWithMX("test@example.com")  
// { valid: true, reason: "OK" }
// { valid: false, reason: "No MX records" }

// Layer 3: Hunter.io Verification (optional, 1 credit)
verifyWithHunter("test@example.com")
// { valid: true, score: 95, deliverable: true }
```

### Blacklisted Domains

Auto-rejects:
- example.com, test.com, localhost
- Temporary email domains (mailinator, 10minutemail, etc.)
- Known spam traps

---

## Lead Scoring

### ICP Configuration

```yaml
# icp.yaml
ideal_customer_profile:
  # Company attributes
  company_size:
    min: 10
    max: 200
    weight: 0.2
  
  industries:
    - restaurant
    - hospitality
    - retail
    - ecommerce
    weight: 0.25
  
  locations:
    - Dubai
    - Abu Dhabi
    - Riyadh
    - Kuwait
    weight: 0.15
  
  # Contact attributes
  titles:
    - CEO
    - Founder
    - Owner
    - Managing Director
    - General Manager
    weight: 0.25
  
  # Signals
  has_website: 0.05
  has_linkedin: 0.05
  verified_email: 0.05

scoring_tiers:
  hot: 80      # Score >= 80
  warm: 60     # Score 60-79
  cold: 0      # Score < 60
```

### Score Output

```json
{
  "name": "Ahmed Al-Rashid",
  "email": "ahmed@restaurant.ae",
  "company": "Al-Rashid Restaurant Group",
  "title": "CEO",
  "score": 87,
  "tier": "hot",
  "breakdown": {
    "title_match": 25,
    "industry_match": 25,
    "location_match": 15,
    "company_size": 12,
    "verified_email": 5,
    "has_linkedin": 5
  },
  "priority": 1,
  "recommended_campaign": "high-touch-outreach"
}
```

---

## Campaign Assignment

```yaml
# campaigns.yaml
campaigns:
  high-touch-outreach:
    tier: hot
    score_min: 80
    sequence:
      - type: personalized_email
        delay_days: 0
        template: templates/hot-first-touch.md
      - type: linkedin_connect
        delay_days: 1
      - type: follow_up_email
        delay_days: 3
        template: templates/hot-follow-up.md
      - type: call
        delay_days: 5

  nurture-sequence:
    tier: warm
    score_min: 60
    score_max: 79
    sequence:
      - type: value_email
        delay_days: 0
        template: templates/warm-value.md
      - type: case_study
        delay_days: 7
      - type: soft_cta
        delay_days: 14

  cold-drip:
    tier: cold
    score_max: 59
    sequence:
      - type: awareness_email
        delay_days: 0
      - type: educational_content
        delay_days: 14
      - type: re_engagement
        delay_days: 30
```

---

## Output Formats

### JSON (default)

```json
{
  "generated": "2026-03-08T12:00:00Z",
  "source": "apollo+maps",
  "total_leads": 147,
  "validation_stats": {
    "valid": 139,
    "invalid_syntax": 3,
    "no_mx_records": 4,
    "blacklisted": 1
  },
  "leads": [...]
}
```

### CSV Export

```csv
name,email,company,title,phone,linkedin,score,tier,campaign
Ahmed Al-Rashid,ahmed@restaurant.ae,Al-Rashid Restaurant,CEO,+971501234567,linkedin.com/in/ahmed,87,hot,high-touch
```

### CRM-Ready (HubSpot/Pipedrive format)

```json
{
  "contacts": [...],
  "companies": [...],
  "deals": [...],
  "import_format": "hubspot_v3"
}
```

---

## API Reference

### Apollo People Search

```javascript
const leads = await apolloSearchPeople({
  query: "CEO",
  domain: "restaurant.ae",  // optional
  location: "Dubai",
  count: 50
});
```

### Apollo Organizations

```javascript
const companies = await apolloSearchOrganizations({
  query: "hospitality",
  location: "UAE",
  employees_min: 10,
  employees_max: 200,
  count: 25
});
```

### Google Maps Search

```javascript
const businesses = await searchGoogleMaps({
  query: "restaurants in Dubai",
  type: "restaurant",
  limit: 100
});
```

---

## Production Stats

From Mubyn's production deployment:

| Metric | Value |
|--------|-------|
| Total leads generated | 1,481 |
| Email validation rate | 93.8% |
| Bounce rate (after validation) | 2.7% |
| Hot leads (score ≥80) | 312 (21%) |
| Warm leads (score 60-79) | 589 (40%) |
| Cold leads (score <60) | 580 (39%) |
| Average enrichment time | 1.2s/lead |

---

## Requirements

- Node.js 18+
- Apollo.io API key (free tier: 50 credits/month)
- Google Maps API key (optional, for local business search)
- Hunter.io API key (optional, for extra email verification)

---

## Files Included

```
ai-lead-gen-sme/
├── SKILL.md                    # This file
├── README.md                   # GitHub readme
├── lead-gen.js                 # Main CLI tool
├── lib/
│   ├── apollo-client.js        # Apollo API wrapper
│   ├── google-maps-client.js   # Google Maps API wrapper
│   ├── email-validator.js      # Email validation (syntax + MX)
│   ├── lead-scorer.js          # ICP scoring engine
│   └── campaign-assigner.js    # Campaign assignment logic
├── templates/
│   ├── hot-first-touch.md      # Email template for hot leads
│   ├── warm-value.md           # Email template for warm leads
│   └── cold-awareness.md       # Email template for cold leads
├── config/
│   ├── icp-example.yaml        # Example ICP configuration
│   └── campaigns-example.yaml  # Example campaign setup
└── examples/
    ├── sample-output.json
    └── sample-leads.csv
```

---

## Pricing

**Free version includes:**
- Apollo People Search (uses your API key)
- Email syntax validation
- Basic lead scoring
- JSON export

**Premium ($79) adds:**
- Google Maps integration
- Full MX record validation
- Hunter.io integration
- Advanced scoring algorithms
- CRM export formats
- Email template library
- Campaign automation
- Priority support

→ Get Premium: mubyn.com/skills/ai-lead-gen-sme

---

*Built by Mubyn. Proven in production. 1,481 leads and counting.* 🎯
