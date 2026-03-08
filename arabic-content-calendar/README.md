# Arabic Content Calendar 📅🇸🇦

> The only AI content calendar with native Arabic RTL support, Islamic calendar awareness, and MENA cultural intelligence.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw Compatible](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.dev)
[![Claude Code Compatible](https://img.shields.io/badge/Claude%20Code-Compatible-purple)](https://claude.ai)

## Why This Exists

Every content calendar tool is English-first, Western-centric. No RTL support. No Ramadan awareness. No understanding of MENA markets.

**420 million Arabic speakers deserve better.**

This skill generates **30-day bilingual content calendars** for Arabic businesses:
- X/Twitter, Instagram, LinkedIn, TikTok
- Native Arabic (not translated garbage)
- Islamic calendar integration
- Cultural sensitivity built-in
- Platform-optimized formats

## Quick Start

```bash
# Clone to your skills directory
git clone https://github.com/mubyn/arabic-content-calendar.git

# Generate a calendar
node generate.js --business "مقهى في دبي" --month "March 2026"
```

## Output

```
output/
├── calendar.json           # Full structured calendar
├── x-twitter/
│   ├── posts-ar.md        # Arabic posts
│   └── posts-en.md        # English posts  
├── instagram/
│   ├── captions-ar.md
│   └── captions-en.md
├── linkedin/
│   └── posts-bilingual.md
└── tiktok/
    └── scripts.md
```

## Supported Industries

- 🍽️ Restaurants & Hospitality
- 🛒 E-commerce
- 🏠 Real Estate
- 💼 Professional Services
- 💄 Beauty & Fashion
- 💻 Tech & SaaS

## Cultural Intelligence

- **Ramadan Mode**: Adjusted posting times (Suhoor/Iftar windows)
- **Eid Content**: Pre-built celebration templates
- **Friday Awareness**: Jummah-friendly scheduling
- **National Days**: UAE, KSA, Egypt, Kuwait, etc.
- **Dialect Support**: MSA, Gulf, Egyptian, Levantine

## Requirements

- Node.js 18+
- OpenAI API key
- OpenClaw or Claude Code (optional, for AI agent use)

## Configuration

Edit `config.yaml`:

```yaml
brand:
  name: "Your Brand"
  name_ar: "علامتك التجارية"
  industry: restaurant
  dialect: gulf  # msa, gulf, egyptian, levantine

calendar:
  month: "March 2026"
  platforms: [x, instagram, linkedin, tiktok]

cultural:
  include_islamic_dates: true
  include_national_days: ["UAE", "KSA"]
```

## Built By

**Mubyn** — AI COO for MENA businesses.  
[mubyn.com](https://mubyn.com)

## License

MIT License. Use it. Modify it. Ship it.

---

*بني للأعمال العربية. Built for Arabic businesses.* 🇸🇦🇦🇪🇪🇬
