---
name: content-calendar
description: |
  AI-powered social media content calendar generator. Full month of platform-specific content
  for X/Twitter, LinkedIn, Instagram, TikTok. Quality gates, industry templates, holiday awareness,
  optimal posting times.
  Triggers: content calendar, social media calendar, content plan, monthly content, social media schedule,
  content strategy, posting schedule, social media planner
tags: [content, social-media, calendar, marketing, content-strategy, scheduling]
author: mubyn
version: 1.0.0
license: MIT
---

# Content Calendar Generator 📅

> AI-powered content calendar that generates a full month of platform-specific social media posts with quality gates, industry templates, and holiday awareness.

## What You Get

```
┌────────────────────────────────────────────────────────────────┐
│                    30-DAY CONTENT CALENDAR                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🐦 X/Twitter (14 posts)     📸 Instagram (12 posts)          │
│  💼 LinkedIn (8 posts)       🎵 TikTok (8 scripts)            │
│                                                                │
│  ✅ Platform-optimized content                                │
│  ✅ Relevant hashtags                                         │
│  ✅ Optimal posting times                                     │
│  ✅ Holiday & seasonal awareness                              │
│  ✅ Quality gates (length, placeholders, completeness)        │
│  ✅ AI image prompts included                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# Simple generation
node generate.js --business "SaaS startup in San Francisco" --month "March 2026"

# With industry template
node generate.js --business "Boutique fitness studio" --template fitness --month "January 2026"

# Specific platforms only
node generate.js --business "Digital agency" --template agency --platforms "linkedin,x" --month "April 2026"

# Quick test (3 posts only)
node generate.js --business "Coffee shop" --template restaurant --platforms "x" --limit 3
```

### Output Structure

```
output/
├── calendar.json              # Full calendar data
├── x/
│   └── posts.md               # X/Twitter posts
├── instagram/
│   └── posts.md               # Instagram captions
├── linkedin/
│   └── posts.md               # LinkedIn posts
└── tiktok/
    └── posts.md               # TikTok scripts
```

---

## Platform Specifications

### X/Twitter
- 14 posts/month (every other day)
- Mix: 40% value, 30% engagement, 20% promotional, 10% seasonal
- 280 character limit enforced
- 4 hashtags per post

### Instagram
- 12 posts/month (3/week)
- Carousel-optimized captions with hooks
- Up to 2200 characters
- 15 hashtags per post

### LinkedIn
- 8 posts/month (2/week)
- Thought leadership focus
- Up to 3000 characters
- 5 hashtags per post

### TikTok
- 8 scripts/month (2/week)
- 30-60 second scripts with hooks
- 6 hashtags per post

---

## Holiday Awareness

The calendar automatically incorporates relevant holidays:

| Holiday | Date | Content Opportunity |
|---------|------|-------------------|
| New Year's Day | Jan 1 | Goal-setting, fresh starts |
| Valentine's Day | Feb 14 | Promotions, appreciation posts |
| International Women's Day | Mar 8 | Empowerment, team spotlights |
| St. Patrick's Day | Mar 17 | Fun/themed content |
| Easter | Apr 5 | Spring content, family themes |
| Earth Day | Apr 22 | Sustainability messaging |
| Mother's Day | May 10 | Appreciation, gift guides |
| Father's Day | Jun 21 | Appreciation content |
| Independence Day (US) | Jul 4 | Patriotic, celebration |
| Labor Day | Sep 7 | End of summer, back to work |
| Halloween | Oct 31 | Creative, themed content |
| Thanksgiving | Nov 26 | Gratitude, community |
| Black Friday | Nov 27 | Sales, deals, urgency |
| Christmas | Dec 25 | Holiday spirit, year in review |
| New Year's Eve | Dec 31 | Reflection, countdown |

Plus UK/EU holidays (May Bank Holiday, Bastille Day, etc.) and awareness days (World Health Day, Mental Health Day, etc.).

---

## Industries Supported

| Industry | Template | Tone & Focus |
|----------|----------|-------------|
| General | `general` | Professional, versatile |
| SaaS / Software | `saas` | Innovative, data-driven, product updates |
| E-commerce | `ecommerce` | Visual, deal-savvy, product showcases |
| Restaurant & Food | `restaurant` | Warm, appetizing, community |
| Agency / Creative | `agency` | Bold, results-driven, case studies |
| Consulting | `consulting` | Authoritative, thought leadership |
| Fitness & Wellness | `fitness` | Motivational, energetic |
| Real Estate | `realestate` | Trustworthy, aspirational |
| Local Services | `services` | Friendly, reliable, testimonials |

---

## Quality Gates

Every piece of content is validated:

1. **Length Check**: Ensures content fits platform limits
2. **Completeness**: No empty or stub posts
3. **Placeholder Detection**: Catches `[brand]`, `lorem ipsum`, etc.
4. **Hashtag Presence**: Every post includes hashtags
5. **Posting Time**: Every post has an optimal time slot

---

## Requirements

- Node.js 18+
- OpenAI API key (`export OPENAI_API_KEY=sk-...`)

## BYOK (Bring Your Own Key)

This skill uses YOUR OpenAI API key. Set it as an environment variable:

```bash
export OPENAI_API_KEY=sk-proj-your-key-here
```

Cost per full calendar (all 4 platforms, ~42 posts): ~$0.15-0.30 with GPT-4o.

---

## Files

```
content-calendar/
├── SKILL.md          # This file
├── README.md         # GitHub readme
├── generate.js       # Main generator script
└── output/           # Generated calendars
```

---

*Built by [Mubyn](https://mubyn.com) — Your AI COO.* ⚔️
