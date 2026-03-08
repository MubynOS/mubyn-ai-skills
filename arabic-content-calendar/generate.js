#!/usr/bin/env node
/**
 * Arabic Content Calendar Generator
 * 
 * Generates a full 30-day bilingual (Arabic + English) content calendar
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
    hashtagsAr: 3,
    hashtagsEn: 4,
    contentMix: { value: 0.4, engagement: 0.3, promotional: 0.2, cultural: 0.1 }
  },
  instagram: {
    name: 'Instagram',
    postsPerMonth: 12,
    maxLength: 2200,
    hashtagsAr: 10,
    hashtagsEn: 15,
    contentMix: { visual: 0.4, educational: 0.3, behindScenes: 0.2, promotional: 0.1 }
  },
  linkedin: {
    name: 'LinkedIn',
    postsPerMonth: 8,
    maxLength: 3000,
    hashtagsAr: 3,
    hashtagsEn: 5,
    contentMix: { thoughtLeadership: 0.4, industry: 0.3, company: 0.2, personal: 0.1 }
  },
  tiktok: {
    name: 'TikTok',
    postsPerMonth: 8,
    scriptDuration: '30-60s',
    contentMix: { trending: 0.3, educational: 0.3, entertainment: 0.25, promotional: 0.15 }
  }
};

const ISLAMIC_MONTHS_2026 = {
  ramadan: { start: '2026-02-17', end: '2026-03-18' },
  eidFitr: { start: '2026-03-19', end: '2026-03-21' },
  eidAdha: { start: '2026-05-26', end: '2026-05-29' }
};

const NATIONAL_DAYS = {
  UAE: [
    { date: '2026-12-02', name: 'National Day', name_ar: 'اليوم الوطني' },
    { date: '2026-11-30', name: 'Commemoration Day', name_ar: 'يوم الشهيد' }
  ],
  KSA: [
    { date: '2026-09-23', name: 'National Day', name_ar: 'اليوم الوطني السعودي' },
    { date: '2026-02-22', name: 'Founding Day', name_ar: 'يوم التأسيس' }
  ],
  Egypt: [
    { date: '2026-07-23', name: 'Revolution Day', name_ar: 'ذكرى ثورة يوليو' },
    { date: '2026-10-06', name: 'Armed Forces Day', name_ar: 'يوم القوات المسلحة' }
  ]
};

// ═══════════════════════════════════════════════════════════════
// CLI Argument Parsing
// ═══════════════════════════════════════════════════════════════

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    business: '',
    businessAr: '',
    month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    template: 'general',
    dialect: 'msa',
    platforms: ['x', 'instagram', 'linkedin', 'tiktok'],
    countries: ['UAE', 'KSA'],
    outputDir: './output'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--business' && args[i + 1]) config.business = args[++i];
    if (arg === '--business-ar' && args[i + 1]) config.businessAr = args[++i];
    if (arg === '--month' && args[i + 1]) config.month = args[++i];
    if (arg === '--template' && args[i + 1]) config.template = args[++i];
    if (arg === '--dialect' && args[i + 1]) config.dialect = args[++i];
    if (arg === '--platforms' && args[i + 1]) config.platforms = args[++i].split(',');
    if (arg === '--output' && args[i + 1]) config.outputDir = args[++i];
    if (arg === '--help' || arg === '-h') {
      console.log(`
Arabic Content Calendar Generator

Usage:
  node generate.js --business "Business Name" --month "March 2026"

Options:
  --business      Business name in English
  --business-ar   Business name in Arabic (optional, will transliterate)
  --month         Target month (e.g., "March 2026", "Ramadan 2026")
  --template      Industry template: restaurant, ecommerce, realestate, services, beauty, tech
  --dialect       Arabic dialect: msa, gulf, egyptian, levantine (default: msa)
  --platforms     Comma-separated: x,instagram,linkedin,tiktok (default: all)
  --output        Output directory (default: ./output)
  --help          Show this help

Examples:
  node generate.js --business "Dubai Coffee" --month "March 2026" --template restaurant
  node generate.js --business "مطعم الشام" --month "Ramadan 2026" --dialect gulf
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
    throw new Error('OPENAI_API_KEY environment variable is required');
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
// Cultural Calendar Logic
// ═══════════════════════════════════════════════════════════════

function getCulturalDates(month, countries) {
  const dates = [];
  
  // Check Islamic dates
  const monthStart = new Date(month + ' 1');
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  
  Object.entries(ISLAMIC_MONTHS_2026).forEach(([event, period]) => {
    const start = new Date(period.start);
    const end = new Date(period.end);
    
    if (start <= monthEnd && end >= monthStart) {
      dates.push({
        type: 'islamic',
        event,
        start: period.start,
        end: period.end
      });
    }
  });

  // Check national days
  countries.forEach(country => {
    (NATIONAL_DAYS[country] || []).forEach(day => {
      const dayDate = new Date(day.date);
      if (dayDate >= monthStart && dayDate < monthEnd) {
        dates.push({
          type: 'national',
          country,
          date: day.date,
          name: day.name,
          name_ar: day.name_ar
        });
      }
    });
  });

  return dates;
}

function isRamadan(month) {
  const monthDate = new Date(month + ' 1');
  const ramadanStart = new Date(ISLAMIC_MONTHS_2026.ramadan.start);
  const ramadanEnd = new Date(ISLAMIC_MONTHS_2026.ramadan.end);
  
  return monthDate >= ramadanStart && monthDate <= ramadanEnd;
}

// ═══════════════════════════════════════════════════════════════
// Content Generation
// ═══════════════════════════════════════════════════════════════

async function generatePlatformContent(platform, config, culturalDates) {
  const spec = PLATFORM_SPECS[platform];
  const isRamadanMonth = isRamadan(config.month);
  
  const systemPrompt = `You are an expert bilingual (Arabic + English) social media content creator for MENA businesses.

CRITICAL RULES:
1. Generate NATIVE Arabic content - NOT translations. Think in Arabic.
2. Use ${config.dialect.toUpperCase()} Arabic dialect appropriately
3. Respect Islamic and cultural sensitivities
4. Match the brand voice and industry context
5. Include relevant hashtags in both languages
6. Format for ${spec.name} specifically (${spec.maxLength ? `max ${spec.maxLength} chars` : spec.scriptDuration})

CULTURAL CONTEXT:
${isRamadanMonth ? '- This is RAMADAN: Adjust posting times, include iftar/suhoor content, spiritual themes' : ''}
${culturalDates.length > 0 ? `- Special dates this month: ${JSON.stringify(culturalDates)}` : ''}

OUTPUT FORMAT:
Return a JSON array of posts. Each post object must have:
{
  "day": 1,
  "date": "2026-03-01",
  "content_en": "English version",
  "content_ar": "النسخة العربية",
  "hashtags_en": ["#tag1", "#tag2"],
  "hashtags_ar": ["#وسم1", "#وسم2"],
  "content_type": "value|engagement|promotional|cultural",
  "posting_time": "09:00",
  "image_prompt": "AI image generation prompt if visual content"
}`;

  const userPrompt = `Generate ${spec.postsPerMonth} ${spec.name} posts for:

Business: ${config.business}${config.businessAr ? ` (${config.businessAr})` : ''}
Industry: ${config.template}
Month: ${config.month}
Dialect: ${config.dialect}

Content mix: ${JSON.stringify(spec.contentMix)}

Generate the full JSON array now.`;

  const response = await callOpenAI(systemPrompt, userPrompt);
  
  // Parse JSON from response
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error(`Warning: Could not parse ${platform} content as JSON`);
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
    // Check Arabic content isn't empty or placeholder
    if (!post.content_ar || post.content_ar.length < 10) {
      issues.push(`Post ${index + 1}: Arabic content too short or missing`);
    }
    
    // Check for Google Translate artifacts
    const translateArtifacts = ['ال ال', 'في في', 'من من'];
    translateArtifacts.forEach(artifact => {
      if (post.content_ar && post.content_ar.includes(artifact)) {
        issues.push(`Post ${index + 1}: Possible translation artifact detected`);
      }
    });
    
    // Platform-specific length check
    if (spec.maxLength && post.content_ar && post.content_ar.length > spec.maxLength) {
      issues.push(`Post ${index + 1}: Arabic content exceeds ${spec.maxLength} character limit`);
    }
    
    // Hashtag presence
    if (!post.hashtags_ar || post.hashtags_ar.length === 0) {
      issues.push(`Post ${index + 1}: Missing Arabic hashtags`);
    }
  });
  
  return issues;
}

// ═══════════════════════════════════════════════════════════════
// Output Generation
// ═══════════════════════════════════════════════════════════════

async function writeOutput(calendar, config) {
  const outputDir = config.outputDir;
  
  // Create directory structure
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
    
    // Arabic posts
    let arabicMd = `# ${PLATFORM_SPECS[platform].name} - المحتوى العربي\n\n`;
    arabicMd += `**الشهر:** ${config.month}\n`;
    arabicMd += `**العلامة التجارية:** ${config.businessAr || config.business}\n\n---\n\n`;
    
    posts.forEach(post => {
      arabicMd += `## يوم ${post.day} (${post.date})\n\n`;
      arabicMd += `**وقت النشر:** ${post.posting_time}\n\n`;
      arabicMd += `${post.content_ar}\n\n`;
      arabicMd += `${(post.hashtags_ar || []).join(' ')}\n\n`;
      if (post.image_prompt) {
        arabicMd += `*وصف الصورة:* ${post.image_prompt}\n\n`;
      }
      arabicMd += `---\n\n`;
    });
    
    await fs.writeFile(path.join(platformDir, 'posts-ar.md'), arabicMd);
    
    // English posts
    let englishMd = `# ${PLATFORM_SPECS[platform].name} - English Content\n\n`;
    englishMd += `**Month:** ${config.month}\n`;
    englishMd += `**Brand:** ${config.business}\n\n---\n\n`;
    
    posts.forEach(post => {
      englishMd += `## Day ${post.day} (${post.date})\n\n`;
      englishMd += `**Posting Time:** ${post.posting_time}\n\n`;
      englishMd += `${post.content_en}\n\n`;
      englishMd += `${(post.hashtags_en || []).join(' ')}\n\n`;
      if (post.image_prompt) {
        englishMd += `*Image Prompt:* ${post.image_prompt}\n\n`;
      }
      englishMd += `---\n\n`;
    });
    
    await fs.writeFile(path.join(platformDir, 'posts-en.md'), englishMd);
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
║          📅 Arabic Content Calendar Generator                  ║
║                       by Mubyn                                 ║
╚═══════════════════════════════════════════════════════════════╝
`);

  const config = parseArgs();
  
  console.log(`🏢 Business: ${config.business}`);
  console.log(`📆 Month: ${config.month}`);
  console.log(`🏭 Template: ${config.template}`);
  console.log(`🗣️ Dialect: ${config.dialect}`);
  console.log(`📱 Platforms: ${config.platforms.join(', ')}`);
  console.log('');

  // Get cultural dates for the month
  const culturalDates = getCulturalDates(config.month, config.countries);
  if (culturalDates.length > 0) {
    console.log('🕌 Cultural dates detected:');
    culturalDates.forEach(d => {
      console.log(`   - ${d.event || d.name} (${d.name_ar || ''})`);
    });
    console.log('');
  }

  const calendar = {
    generated: new Date().toISOString(),
    business: config.business,
    businessAr: config.businessAr,
    month: config.month,
    dialect: config.dialect,
    culturalDates,
    platforms: {},
    qualityReport: {}
  };

  // Generate content for each platform
  for (const platform of config.platforms) {
    if (!PLATFORM_SPECS[platform]) {
      console.warn(`⚠️ Unknown platform: ${platform}, skipping`);
      continue;
    }

    console.log(`⏳ Generating ${PLATFORM_SPECS[platform].name} content...`);
    
    try {
      const posts = await generatePlatformContent(platform, config, culturalDates);
      calendar.platforms[platform] = posts;
      
      // Run quality gates
      const issues = validateContent(posts, platform);
      calendar.qualityReport[platform] = {
        postsGenerated: posts.length,
        issues: issues,
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

  // Write output
  await writeOutput(calendar, config);
  
  // Summary
  console.log('\n📊 Summary:');
  let totalPosts = 0;
  Object.entries(calendar.platforms).forEach(([platform, posts]) => {
    console.log(`   ${PLATFORM_SPECS[platform].name}: ${posts.length} posts`);
    totalPosts += posts.length;
  });
  console.log(`   Total: ${totalPosts} posts generated`);
  
  if (isRamadan(config.month)) {
    console.log('\n🌙 Ramadan Mode: Posting times adjusted for Suhoor/Iftar');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
