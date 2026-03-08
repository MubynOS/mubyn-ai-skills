---
name: arabic-content-calendar
description: |
  Bilingual Arabic + English social media content calendar generator. Full month of content.
  Platform-specific: X/Twitter, LinkedIn, Instagram, TikTok. Native Arabic RTL support.
  Quality gates. Cultural awareness. Islamic calendar integration. MENA market expertise.
  Triggers: arabic content, محتوى عربي, content calendar, social media calendar, bilingual content,
  arabic social media, تقويم محتوى, مواقع التواصل الاجتماعي, MENA marketing, arabic posts
tags: [arabic, content, social-media, calendar, bilingual, mena, marketing, rtl]
author: mubyn
version: 1.0.0
license: MIT
---

# Arabic Content Calendar 📅🇸🇦

> **Zero competition.** The only AI content calendar skill with native Arabic RTL support, Islamic calendar awareness, and MENA cultural intelligence.

## The Problem

Every content calendar tool is English-first, Western-centric:
- No RTL (right-to-left) support
- Ignores Ramadan, Eid, national holidays
- Generic Western marketing advice
- Arabic as an afterthought (bad translations)

Your MENA clients deserve better. This skill delivers.

---

## What You Get

```
┌────────────────────────────────────────────────────────────────┐
│                    30-DAY CONTENT CALENDAR                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🐦 X/Twitter (14 posts)     📸 Instagram (12 posts)          │
│  💼 LinkedIn (8 posts)       🎵 TikTok (8 scripts)            │
│                                                                │
│  ✅ Arabic + English versions for each post                   │
│  ✅ Hashtags (AR + EN)                                        │
│  ✅ Optimal posting times for GCC timezone                    │
│  ✅ Islamic/cultural calendar integration                      │
│  ✅ Quality gates (authenticity, cultural sensitivity)         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Generate a Full Month

```bash
# Simple generation
generate-arabic-calendar --business "Coffee shop in Dubai" --month "March 2026"

# With industry template
generate-arabic-calendar --template restaurant --brand "مطعم الشام" --month "Ramadan 2026"

# E-commerce focus
generate-arabic-calendar --template ecommerce --brand "Noon" --niche "electronics" --month "April 2026"
```

### Output Structure

```
output/
├── calendar-march-2026.json       # Full calendar data
├── x-twitter/
│   ├── posts-ar.md                # Arabic posts
│   ├── posts-en.md                # English posts
│   └── threads/                   # Thread content
├── instagram/
│   ├── captions-ar.md
│   ├── captions-en.md
│   └── reels-scripts/
├── linkedin/
│   ├── posts-ar.md
│   └── posts-en.md
├── tiktok/
│   └── scripts/
└── assets/
    └── image-prompts.md           # AI image generation prompts
```

---

## Platform Specifications

### X/Twitter
- 14 posts/month (every other day)
- Mix: 40% value, 30% engagement, 20% promotional, 10% cultural
- Thread capability for thought leadership
- Arabic hashtag research built-in

### Instagram
- 12 posts/month (3/week)
- Carousel-optimized captions
- Reels scripts with hooks
- Story content suggestions

### LinkedIn
- 8 posts/month (2/week)
- Professional Arabic tone (formal register)
- B2B positioning
- Document/carousel ideas

### TikTok
- 8 scripts/month (2/week)
- Hook-first structure
- Trending sound suggestions
- Arabic subtitles guidance

---

## Cultural Intelligence

### Islamic Calendar Integration
- **Ramadan**: Adjusted posting times (Suhoor/Iftar windows)
- **Eid al-Fitr & Eid al-Adha**: Celebration content
- **Friday**: Jummah-aware scheduling
- **National Days**: UAE, KSA, Egypt, etc.

### Quality Gates
Every piece of content passes through:

1. **Authenticity Check**: No robotic Arabic, no Google Translate vibes
2. **Cultural Sensitivity**: Respects local norms
3. **Dialect Awareness**: MSA vs Gulf vs Egyptian (configurable)
4. **Religious Respect**: Appropriate for Islamic context
5. **Brand Voice Match**: Consistent personality

---

## Industries Supported

| Industry | Template | Special Features |
|----------|----------|------------------|
| Restaurant | `restaurant` | Menu highlights, Ramadan Iftar specials |
| E-commerce | `ecommerce` | Flash sales, product launches |
| Real Estate | `realestate` | Property showcases, market insights |
| Professional Services | `services` | Thought leadership, case studies |
| Beauty/Fashion | `beauty` | Trend content, tutorials |
| Tech/SaaS | `tech` | Product updates, industry news |

---

## Configuration

### `config.yaml`

```yaml
brand:
  name: "Your Brand"
  name_ar: "علامتك التجارية"
  industry: restaurant
  tone: friendly  # formal, casual, professional, friendly
  dialect: gulf   # msa, gulf, egyptian, levantine

calendar:
  month: "March 2026"
  platforms:
    x: true
    instagram: true
    linkedin: true
    tiktok: false
  
cultural:
  include_islamic_dates: true
  include_national_days: ["UAE", "KSA"]
  ramadan_mode: false  # Auto-detects, but can force

posting_times:
  timezone: "Asia/Dubai"
  x: ["09:00", "13:00", "20:00"]
  instagram: ["12:00", "19:00"]
  linkedin: ["08:00", "17:00"]
  tiktok: ["18:00", "21:00"]
```

---

## Example Output

### X/Twitter Post

**English:**
```
☕ The secret to the perfect Arabic coffee?

Patience.

7 minutes of slow brewing. No shortcuts.

That's how we make every cup at [Brand].

#ArabicCoffee #Dubai #CoffeeCulture
```

**العربية:**
```
☕ سر القهوة العربية المثالية؟

الصبر.

٧ دقائق من التحضير البطيء. بدون اختصارات.

هكذا نحضّر كل فنجان في [العلامة].

#قهوة_عربية #دبي #عالم_القهوة
```

---

### Instagram Caption

**English:**
```
When the aroma hits before the first sip... ☕✨

There's a reason Arabic coffee has been bringing people together for centuries.

It's not just a drink. It's a tradition. A welcome. A conversation starter.

Tag someone you'd share this cup with 👇

#ArabicCoffee #GulfCulture #CoffeeLovers #Dubai #Hospitality
```

**العربية:**
```
عندما تصل الرائحة قبل أول رشفة... ☕✨

هناك سبب يجعل القهوة العربية تجمع الناس منذ قرون.

ليست مجرد مشروب. إنها تراث. ترحيب. بداية حديث.

تاق شخص تريد مشاركته هذا الفنجان 👇

#قهوة_عربية #ثقافة_خليجية #عشاق_القهوة #دبي #ضيافة
```

---

## Why This Skill Exists

Built by **Mubyn** — the AI COO for MENA businesses. We serve Arabic-speaking SMEs every day. This isn't a translation layer. It's native Arabic content intelligence.

**Market reality:**
- 420M Arabic speakers
- $46B AI market in MENA by 2030
- Zero competition in Arabic AI content tools

---

## Requirements

- OpenClaw / Claude Code instance
- OpenAI API key (for content generation)
- Internet access (for cultural calendar data)

---

## Files Included

```
arabic-content-calendar/
├── SKILL.md                    # This file
├── README.md                   # GitHub readme
├── generate.js                 # Main generator script
├── lib/
│   ├── calendar-engine.js      # Content scheduling logic
│   ├── cultural-dates.js       # Islamic + national holidays
│   ├── quality-gates.js        # Content validation
│   ├── platform-specs.js       # Platform-specific formatting
│   └── arabic-utils.js         # RTL, dialect handling
├── templates/
│   ├── restaurant.yaml
│   ├── ecommerce.yaml
│   ├── realestate.yaml
│   └── services.yaml
├── prompts/
│   ├── x-twitter.md
│   ├── instagram.md
│   ├── linkedin.md
│   └── tiktok.md
└── examples/
    └── sample-output/
```

---

## Premium Version

**Free version includes:**
- 1 month calendar generation
- 2 platforms (X + Instagram)
- MSA Arabic only
- Basic quality gates

**Premium ($49) adds:**
- Unlimited months
- All 4 platforms
- Dialect customization (Gulf, Egyptian, Levantine)
- Ramadan special mode
- Full cultural calendar (all MENA countries)
- Image prompt generation
- Content performance tracking
- Priority support

→ Get Premium: mubyn.com/skills/arabic-content-calendar

---

*بني للأعمال العربية. Built for Arabic businesses.* 🇸🇦🇦🇪🇪🇬

