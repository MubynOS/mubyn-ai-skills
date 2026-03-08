# Content Calendar Generator 📅

> AI-powered social media content calendar. Full month of platform-specific posts for X/Twitter, Instagram, LinkedIn, and TikTok.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw Compatible](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.dev)

## Features

- **42 posts/month** across 4 platforms (X: 14, Instagram: 12, LinkedIn: 8, TikTok: 8)
- **9 industry templates**: SaaS, e-commerce, restaurant, agency, consulting, fitness, real estate, services, general
- **Holiday awareness**: US, UK, EU holidays + awareness days automatically incorporated
- **Quality gates**: Length checks, placeholder detection, completeness validation
- **AI image prompts**: Every visual post includes a generation prompt
- **BYOK**: Uses your own OpenAI API key (~$0.15-0.30 per full calendar)

## Quick Start

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-proj-your-key-here

# Generate a full month calendar
node generate.js --business "SaaS startup in San Francisco" --month "March 2026"

# Use an industry template
node generate.js --business "Downtown pizza restaurant" --template restaurant --month "December 2026"

# Test with limited posts
node generate.js --business "Digital agency" --template agency --platforms "x" --limit 3
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--business` | Business name/description (required) | — |
| `--month` | Target month | Current month |
| `--template` | Industry template | `general` |
| `--platforms` | Comma-separated platforms | `x,instagram,linkedin,tiktok` |
| `--output` | Output directory | `./output` |
| `--limit` | Max posts per platform (for testing) | All |

## Example Output

### X/Twitter Post
```
🚀 Stop building features nobody asked for.

We talked to 50 customers last month. The #1 request? 
A simpler onboarding flow.

So we rebuilt it from scratch. 3 steps instead of 12.

Result: 40% more activations.

Listen first. Build second.

#SaaS #ProductDev #StartupLife #CustomerFirst
```

### LinkedIn Post
```
I used to think "move fast and break things" was good advice.

Then our deploy broke production on a Friday at 5pm. 
3 hours of downtime. 200 angry support tickets.

Here's what I learned about shipping fast WITHOUT breaking things:

1. Feature flags > big bang releases
2. Canary deploys catch 90% of issues  
3. "Move fast" means automated testing, not skipping it
4. Friday deploys are never worth it

Speed isn't about recklessness. It's about confidence in your systems.

What's your worst deploy story? 👇

#Engineering #SaaS #StartupLife #DevOps #TechLeadership
```

## Output Structure

```
output/
├── calendar.json        # Full structured data (JSON)
├── x/
│   └── posts.md         # Ready-to-post X content
├── instagram/
│   └── posts.md         # Instagram captions + image prompts
├── linkedin/
│   └── posts.md         # LinkedIn posts
└── tiktok/
    └── posts.md         # TikTok scripts
```

## Industry Templates

- `saas` — Product updates, customer success, engineering culture
- `ecommerce` — Product showcases, flash sales, unboxing
- `restaurant` — Menu highlights, chef stories, seasonal specials
- `agency` — Case studies, campaign results, creative process
- `consulting` — Thought leadership, frameworks, market analysis
- `fitness` — Workout tips, transformations, challenges
- `realestate` — Property showcases, market updates, buying tips
- `services` — Before/after, testimonials, seasonal tips
- `general` — Versatile business content

## Requirements

- Node.js 18+
- OpenAI API key

## License

MIT — Use it. Modify it. Ship it.

---

*Built by [Mubyn](https://mubyn.com)* ⚔️
