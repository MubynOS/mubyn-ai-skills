# AI Lead Gen SME 🎯

> Battle-tested lead generation for SMEs. Apollo + Google Maps + Email validation. 1,481 leads generated in production.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw Compatible](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.dev)

## Why This Exists

Lead generation is broken for SMEs:
- 22% email bounce rates (bad data)
- Hours of manual research
- $300+/month for enterprise tools
- No scoring or prioritization

This skill automates the entire pipeline: **Find → Validate → Score → Assign**

## Quick Start

```bash
# Set your API keys
export APOLLO_API_KEY="your_key"
export GOOGLE_MAPS_API_KEY="your_key"  # optional

# Search for leads
node lead-gen.js search --source apollo --query "CEO" --industry "restaurant" --location "Dubai"

# Validate emails (reduces bounce rate to <3%)
node lead-gen.js validate --input leads.json --mx-check --output validated.json

# Score against your ICP
node lead-gen.js score --input validated.json --icp-config icp.yaml

# Assign to campaigns
node lead-gen.js assign --input scored.json --campaigns campaigns.yaml
```

## Email Validation

Three-layer validation that reduces bounce rates from 22% to under 3%:

1. **Syntax check** — RFC 5322 compliant
2. **MX record verification** — DNS lookup
3. **Hunter.io** — (optional) deliverability scoring

```javascript
const { validateEmailWithMX } = require('./lib/email-validator');

const result = await validateEmailWithMX('test@example.com');
// { valid: true, reason: "OK" }
// { valid: false, reason: "No MX records" }
```

## Lead Scoring

Score leads against your Ideal Customer Profile:

```yaml
# icp.yaml
ideal_customer_profile:
  industries: [restaurant, retail, ecommerce]
  titles: [CEO, Founder, Owner]
  company_size: { min: 10, max: 200 }
  locations: [Dubai, Riyadh, Kuwait]
```

Output:
```json
{
  "name": "Ahmed Al-Rashid",
  "score": 87,
  "tier": "hot",
  "recommended_campaign": "high-touch-outreach"
}
```

## Production Stats

| Metric | Value |
|--------|-------|
| Total leads generated | 1,481 |
| Email validation rate | 93.8% |
| Bounce rate (post-validation) | 2.7% |
| Hot leads (≥80) | 21% |

## Requirements

- Node.js 18+
- Apollo.io API key
- Google Maps API key (optional)
- Hunter.io API key (optional)

## Built By

**Mubyn** — AI COO for SMEs  
[mubyn.com](https://mubyn.com)

## License

MIT
