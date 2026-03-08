#!/usr/bin/env node
/**
 * Content Calendar Generator
 * 
 * Generates a full 30-day English content calendar
 * for X/Twitter, Instagram, LinkedIn, and TikTok.
 * 
 * @author Mubyn (mubyn.com)
 * @license MIT
 */

const fs = require('fs').promises;
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// Configuration & Constants
// ═══════════════════════════════════════════════════════════════

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

const PLATFORM_SPECS = {
  x: {
    name: 'X/Twitter',
    postsPerMonth: 14,
    maxLength: 280,
    hashtags: 4,
    contentMix: { value: 0.4, engagement: 0.3, promotional: 0.2, seasonal: 0.1 }
  },
  instagram: {
    name: 'Instagram',
    postsPerMonth: 12,
    maxLength: 2200,
    hashtags: 15,
    contentMix: { visual: 0.4, educational: 0.3, behindScenes: 0.2, promotional: 0.1 }
  },
  linkedin: {
    name: 'LinkedIn',
    postsPerMonth: 8,
    maxLength: 3000,
    hashtags: 5,
    contentMix: { thoughtLeadership: 0.4, industry: 0.3, company: 0.2, personal: 0.1 }
  },
  tiktok: {
    name: 'TikTok',
    postsPerMonth: 8,
    scriptDuration: '30-60s',
    hashtags: 6,
    contentMix: { trending: 0.3, educational: 0.3, entertainment: 0.25, promotional: 0.15 }
  }
};

// Western holidays (US, UK, EU, global)
const HOLIDAYS_2026 = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-20', name: 'Martin Luther King Jr. Day (US)' },
  { date: '2026-02-14', name: "Valentine's Day" },
  { date: '2026-02-16', name: "Presidents' Day (US)" },
  { date: '2026-03-08', name: "International Women's Day" },
  { date: '2026-03-17', name: "St. Patrick's Day" },
  { date: '2026-04-05', name: 'Easter Sunday' },
  { date: '2026-04-22', name: 'Earth Day' },
  { date: '2026-05-10', name: "Mother's Day (US)" },
  { date: '2026-05-25', name: 'Memorial Day (US)' },
  { date: '2026-06-21', name: "Father's Day (US)" },
  { date: '2026-07-04', name: 'Independence Day (US)' },
  { date: '2026-09-07', name: 'Labor Day (US)' },
  { date: '2026-10-31', name: 'Halloween' },
  { date: '2026-11-11', name: 'Veterans Day (US)' },
  { date: '2026-11-26', name: 'Thanksgiving (US)' },
  { date: '2026-11-27', name: 'Black Friday' },
  { date: '2026-11-30', name: 'Cyber Monday' },
  { date: '2026-12-24', name: 'Christmas Eve' },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-31', name: "New Year's Eve" },
  // UK/EU
  { date: '2026-03-29', name: 'British Summer Time begins (UK)' },
  { date: '2026-05-04', name: 'Early May Bank Holiday (UK)' },
  { date: '2026-05-01', name: 'Labour Day (EU)' },
  { date: '2026-10-03', name: 'German Unity Day (DE)' },
  { date: '2026-07-14', name: 'Bastille Day (FR)' },
  // Social media awareness days
  { date: '2026-01-24', name: 'International Day of Education' },
  { date: '2026-02-11', name: 'Safer Internet Day' },
  { date: '2026-04-07', name: 'World Health Day' },
  { date: '2026-06-05', name: 'World Environment Day' },
  { date: '2026-10-10', name: 'World Mental Health Day' },
  { date: '2026-11-19', name: 'International Men\'s Day' },
];

// Industry templates with tone and content guidance
const INDUSTRY_TEMPLATES = {
  general: {
    name: 'General Business',
    tone: 'professional yet approachable',
    themes: ['industry insights', 'tips & tricks', 'behind the scenes', 'customer stories', 'team highlights']
  },
  saas: {
    name: 'SaaS / Software',
    tone: 'innovative, clear, data-driven',
    themes: ['product updates', 'use cases', 'customer success', 'industry trends', 'tips & tutorials', 'engineering culture']
  },
  ecommerce: {
    name: 'E-commerce',
    tone: 'exciting, deal-savvy, visual',
    themes: ['product showcases', 'flash sales', 'customer reviews', 'seasonal collections', 'unboxing', 'styling tips']
  },
  restaurant: {
    name: 'Restaurant & Food',
    tone: 'warm, appetizing, community-focused',
    themes: ['menu highlights', 'chef stories', 'food prep BTS', 'seasonal specials', 'customer moments', 'local sourcing']
  },
  agency: {
    name: 'Agency / Creative',
    tone: 'creative, bold, results-driven',
    themes: ['case studies', 'campaign results', 'team spotlights', 'industry commentary', 'creative process', 'client wins']
  },
  consulting: {
    name: 'Consulting / Professional Services',
    tone: 'authoritative, insightful, trustworthy',
    themes: ['thought leadership', 'frameworks', 'client transformations', 'market analysis', 'expert Q&A', 'white papers']
  },
  fitness: {
    name: 'Fitness & Wellness',
    tone: 'motivational, energetic, supportive',
    themes: ['workout tips', 'transformation stories', 'nutrition advice', 'class schedules', 'member spotlights', 'challenges']
  },
  realestate: {
    name: 'Real Estate',
    tone: 'trustworthy, aspirational, local-expert',
    themes: ['property showcases', 'market updates', 'neighborhood guides', 'buying tips', 'success stories', 'open houses']
  },
  services: {
    name: 'Local Services',
    tone: 'friendly, reliable, community-oriented',
    themes: ['before/after', 'customer testimonials', 'seasonal tips', 'team introductions', 'service spotlights', 'local events']
  }
};

// ═══════════════════════════════════════════════════════════════
// CLI Argument Parsing
// ═══════════════════════════════════════════════════════════════

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    business: '',
    month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    template: 'general',
    platforms: ['x', 'instagram', 'linkedin', 'tiktok'],
    outputDir: './output',
    limit: 0 // 0 = no limit (use platform default)
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--business' && args[i + 1]) config.business = args[++i];
    if (arg === '--month' && args[i + 1]) config.month = args[++i];
    if (arg === '--template' && args[i + 1]) config.template = args[++i];
    if (arg === '--platforms' && args[i + 1]) config.platforms = args[++i].split(',');
    if (arg === '--output' && args[i + 1]) config.outputDir = args[++i];
    if (arg === '--limit' && args[i + 1]) config.limit = parseInt(args[++i], 10);
    if (arg === '--help' || arg === '-h') {
      console.log(`
Content Calendar Generator

Usage:
  node generate.js --business "Business Name" --month "March 2026"

Options:
  --business      Business name / description
  --month         Target month (e.g., "March 2026")
  --template      Industry template: saas, ecommerce, restaurant, agency, consulting, fitness, realestate, services, general
  --platforms     Comma-separated: x,instagram,linkedin,tiktok (default: all)
  --output        Output directory (default: ./output)
  --limit         Limit posts per platform (for testing)
  --help          Show this help

Examples:
  node generate.js --business "SaaS startup in San Francisco" --month "March 2026"
  node generate.js --business "Boutique fitness studio" --template fitness --month "January 2026"
  node generate.js --business "Digital agency" --template agency --platforms "linkedin,x" --month "April 2026"
      `);
      process.exit(0);
    }
  }

  if (!config.business) {
    console.error('Error: --business is required');
    process.exit(1);
  }

  return config;
}

// ═══════════════════════════════════════════════════════════════
// OpenAI Integration
// ═══════════════════════════════════════════════════════════════

async function callOpenAI(systemPrompt, userPrompt, maxTokens = 4000) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required. Set it: export OPENAI_API_KEY=sk-...');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.8
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ═══════════════════════════════════════════════════════════════
// Holiday Calendar Logic
// ═══════════════════════════════════════════════════════════════

function getHolidaysForMonth(month) {
  const monthStart = new Date(month + ' 1');
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);

  return HOLIDAYS_2026.filter(h => {
    const d = new Date(h.date);
    return d >= monthStart && d < monthEnd;
  });
}

// ═══════════════════════════════════════════════════════════════
// Content Generation
// ═══════════════════════════════════════════════════════════════

async function generatePlatformContent(platform, config, holidays) {
  const spec = PLATFORM_SPECS[platform];
  const industry = INDUSTRY_TEMPLATES[config.template] || INDUSTRY_TEMPLATES.general;
  const postCount = config.limit > 0 ? Math.min(config.limit, spec.postsPerMonth) : spec.postsPerMonth;

  const systemPrompt = `You are an expert social media content creator.

CRITICAL RULES:
1. Generate compelling, platform-native English content
2. Match the brand voice: ${industry.tone}
3. Format specifically for ${spec.name} (${spec.maxLength ? `max ${spec.maxLength} chars` : spec.scriptDuration})
4. Include relevant hashtags (${spec.hashtags} per post)
5. Each post should be unique and varied in style
6. Use optimal posting times for maximum engagement

INDUSTRY: ${industry.name}
KEY THEMES: ${industry.themes.join(', ')}

${holidays.length > 0 ? `HOLIDAYS THIS MONTH (incorporate relevant ones):\n${holidays.map(h => `- ${h.date}: ${h.name}`).join('\n')}` : ''}

OUTPUT FORMAT:
Return a JSON array of posts. Each post object must have:
{
  "day": 1,
  "date": "2026-03-01",
  "content": "The post content",
  "hashtags": ["#tag1", "#tag2"],
  "content_type": "value|engagement|promotional|seasonal",
  "posting_time": "09:00",
  "image_prompt": "AI image generation prompt if visual content needed"
}`;

  const userPrompt = `Generate ${postCount} ${spec.name} posts for:

Business: ${config.business}
Industry: ${industry.name}
Month: ${config.month}

Content mix: ${JSON.stringify(spec.contentMix)}

Generate the full JSON array now.`;

  const response = await callOpenAI(systemPrompt, userPrompt);

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error(`Warning: Could not parse ${platform} content as JSON, raw response saved`);
  }

  return [];
}

// ═══════════════════════════════════════════════════════════════
// Quality Gates
// ═══════════════════════════════════════════════════════════════

function validateContent(posts, platform) {
  const spec = PLATFORM_SPECS[platform];
  const issues = [];

  posts.forEach((post, index) => {
    if (!post.content || post.content.length < 10) {
      issues.push(`Post ${index + 1}: Content too short or missing`);
    }

    if (spec.maxLength && post.content && post.content.length > spec.maxLength) {
      issues.push(`Post ${index + 1}: Content exceeds ${spec.maxLength} character limit (${post.content.length} chars)`);
    }

    if (!post.hashtags || post.hashtags.length === 0) {
      issues.push(`Post ${index + 1}: Missing hashtags`);
    }

    if (!post.posting_time) {
      issues.push(`Post ${index + 1}: Missing posting time`);
    }

    // Check for generic/placeholder content
    const genericPhrases = ['lorem ipsum', '[brand]', '[business]', 'insert here'];
    genericPhrases.forEach(phrase => {
      if (post.content && post.content.toLowerCase().includes(phrase)) {
        issues.push(`Post ${index + 1}: Contains placeholder text "${phrase}"`);
      }
    });
  });

  return issues;
}

// ═══════════════════════════════════════════════════════════════
// Output Generation
// ═══════════════════════════════════════════════════════════════

async function writeOutput(calendar, config) {
  const outputDir = config.outputDir;
  await fs.mkdir(outputDir, { recursive: true });

  // Write main calendar JSON
  await fs.writeFile(
    path.join(outputDir, 'calendar.json'),
    JSON.stringify(calendar, null, 2)
  );

  // Write platform-specific markdown files
  for (const [platform, posts] of Object.entries(calendar.platforms)) {
    const platformDir = path.join(outputDir, platform);
    await fs.mkdir(platformDir, { recursive: true });

    let md = `# ${PLATFORM_SPECS[platform].name} — Content Calendar\n\n`;
    md += `**Business:** ${config.business}\n`;
    md += `**Month:** ${config.month}\n`;
    md += `**Posts:** ${posts.length}\n\n---\n\n`;

    posts.forEach(post => {
      md += `## Day ${post.day} (${post.date})\n\n`;
      md += `**Type:** ${post.content_type} · **Post at:** ${post.posting_time}\n\n`;
      md += `${post.content}\n\n`;
      md += `${(post.hashtags || []).join(' ')}\n\n`;
      if (post.image_prompt) {
        md += `*🎨 Image Prompt:* ${post.image_prompt}\n\n`;
      }
      md += `---\n\n`;
    });

    await fs.writeFile(path.join(platformDir, 'posts.md'), md);
  }

  console.log(`\n✅ Calendar generated successfully!`);
  console.log(`📁 Output directory: ${outputDir}`);
}

// ═══════════════════════════════════════════════════════════════
// Main Execution
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║            📅 Content Calendar Generator                      ║
║                       by Mubyn                                ║
╚═══════════════════════════════════════════════════════════════╝
`);

  const config = parseArgs();

  console.log(`🏢 Business: ${config.business}`);
  console.log(`📆 Month: ${config.month}`);
  console.log(`🏭 Template: ${config.template}`);
  console.log(`📱 Platforms: ${config.platforms.join(', ')}`);
  if (config.limit > 0) console.log(`🔢 Limit: ${config.limit} posts per platform`);
  console.log('');

  const holidays = getHolidaysForMonth(config.month);
  if (holidays.length > 0) {
    console.log('🎉 Holidays this month:');
    holidays.forEach(h => console.log(`   - ${h.date}: ${h.name}`));
    console.log('');
  }

  const calendar = {
    generated: new Date().toISOString(),
    business: config.business,
    month: config.month,
    template: config.template,
    holidays,
    platforms: {},
    qualityReport: {}
  };

  for (const platform of config.platforms) {
    if (!PLATFORM_SPECS[platform]) {
      console.warn(`⚠️ Unknown platform: ${platform}, skipping`);
      continue;
    }

    console.log(`⏳ Generating ${PLATFORM_SPECS[platform].name} content...`);

    try {
      const posts = await generatePlatformContent(platform, config, holidays);
      calendar.platforms[platform] = posts;

      const issues = validateContent(posts, platform);
      calendar.qualityReport[platform] = {
        postsGenerated: posts.length,
        issues,
        passed: issues.length === 0
      };

      if (issues.length > 0) {
        console.log(`   ⚠️ Quality issues found: ${issues.length}`);
        issues.forEach(issue => console.log(`      - ${issue}`));
      } else {
        console.log(`   ✅ ${posts.length} posts generated, quality check passed`);
      }
    } catch (error) {
      console.error(`   ❌ Error generating ${platform}: ${error.message}`);
      calendar.platforms[platform] = [];
      calendar.qualityReport[platform] = { error: error.message };
    }
  }

  await writeOutput(calendar, config);

  console.log('\n📊 Summary:');
  let totalPosts = 0;
  Object.entries(calendar.platforms).forEach(([platform, posts]) => {
    console.log(`   ${PLATFORM_SPECS[platform].name}: ${posts.length} posts`);
    totalPosts += posts.length;
  });
  console.log(`   Total: ${totalPosts} posts generated`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
