#!/usr/bin/env node
/**
 * AI Lead Gen SME - Main CLI Tool
 * 
 * Generate, validate, score, and assign leads automatically.
 * 
 * @author Mubyn (mubyn.com)
 * @license MIT
 */

const fs = require('fs').promises;
const path = require('path');
const dns = require('dns').promises;

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════

const APOLLO_API_KEY = process.env.APOLLO_API_KEY || '';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const HUNTER_API_KEY = process.env.HUNTER_API_KEY || '';

const BLACKLISTED_DOMAINS = [
  'example.com', 'test.com', 'localhost', 'invalid.com',
  'mailinator.com', '10minutemail.com', 'tempmail.com',
  'guerrillamail.com', 'throwaway.email', 'fakeinbox.com'
];

// ═══════════════════════════════════════════════════════════════
// Email Validation (The Secret Sauce)
// ═══════════════════════════════════════════════════════════════

/**
 * Basic email syntax validation (instant, no network)
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim().toLowerCase());
}

/**
 * Full email validation: syntax + MX record check
 * Returns: { valid: boolean, reason: string }
 */
async function validateEmailWithMX(email) {
  if (!validateEmail(email)) {
    return { valid: false, reason: 'Invalid syntax' };
  }
  
  const domain = email.split('@')[1].toLowerCase();
  
  // Blacklist check
  if (BLACKLISTED_DOMAINS.includes(domain)) {
    return { valid: false, reason: 'Blacklisted domain' };
  }
  
  // MX record check
  try {
    const mxRecords = await Promise.race([
      dns.resolveMx(domain),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ]);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, reason: 'No MX records' };
    }
    return { valid: true, reason: 'OK' };
  } catch (err) {
    return { valid: false, reason: `DNS error: ${err.message}` };
  }
}

/**
 * Hunter.io verification (optional, uses API credits)
 */
async function verifyWithHunter(email) {
  if (!HUNTER_API_KEY) {
    return { valid: null, reason: 'Hunter API key not configured' };
  }
  
  try {
    const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${HUNTER_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return { valid: null, reason: 'Hunter API error' };
    
    const data = await res.json();
    return {
      valid: data.data?.result === 'deliverable',
      score: data.data?.score || 0,
      reason: data.data?.result || 'unknown'
    };
  } catch (err) {
    return { valid: null, reason: err.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// Apollo API Integration
// ═══════════════════════════════════════════════════════════════

async function apolloSearchPeople(options = {}) {
  if (!APOLLO_API_KEY) {
    console.error('Error: APOLLO_API_KEY not set');
    return [];
  }
  
  const { query, domain, firstName, lastName, location, industry, count = 25 } = options;
  
  const searchBody = { per_page: Math.min(count, 25) };
  if (domain) searchBody.q_organization_domains = domain;
  if (firstName) searchBody.first_name = firstName;
  if (lastName) searchBody.last_name = lastName;
  if (query) searchBody.q_organization_name = query;
  if (location) searchBody.person_locations = [location];
  
  try {
    const res = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'X-Api-Key': APOLLO_API_KEY 
      },
      body: JSON.stringify(searchBody)
    });
    
    if (!res.ok) {
      console.error(`Apollo API error: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    return (data.people || []).map(p => ({
      source: 'apollo',
      name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
      email: p.email || null,
      phone: p.phone_numbers?.[0]?.number || null,
      title: p.title || null,
      company: p.organization?.name || null,
      linkedin: p.linkedin_url || null,
      location: p.city || p.country || null,
      raw: p
    }));
  } catch (err) {
    console.error(`Apollo search error: ${err.message}`);
    return [];
  }
}

async function apolloSearchOrganizations(options = {}) {
  if (!APOLLO_API_KEY) return [];
  
  const { query, location, industry, count = 25 } = options;
  
  const searchBody = {
    per_page: Math.min(count, 25),
    organization_num_employees_ranges: ['1,10', '11,20', '21,50', '51,100', '101,200']
  };
  if (query) searchBody.q_organization_keyword_tags = [query];
  if (location) searchBody.organization_locations = [location];
  if (industry) searchBody.q_organization_name = industry;
  
  try {
    const res = await fetch('https://api.apollo.io/v1/mixed_organizations/search', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'X-Api-Key': APOLLO_API_KEY 
      },
      body: JSON.stringify(searchBody)
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    return data.organizations || data.accounts || [];
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// Google Maps API Integration
// ═══════════════════════════════════════════════════════════════

async function searchGoogleMaps(options = {}) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Error: GOOGLE_MAPS_API_KEY not set');
    return [];
  }
  
  const { query, type, limit = 20 } = options;
  const results = [];
  let nextPageToken = null;
  
  while (results.length < limit) {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
    if (type) url += `&type=${type}`;
    if (nextPageToken) url += `&pagetoken=${nextPageToken}`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error(`Google Maps API error: ${data.status}`);
        break;
      }
      
      for (const place of data.results || []) {
        if (results.length >= limit) break;
        results.push({
          source: 'google_maps',
          name: place.name,
          address: place.formatted_address,
          place_id: place.place_id,
          rating: place.rating,
          reviews: place.user_ratings_total,
          types: place.types
        });
      }
      
      nextPageToken = data.next_page_token;
      if (!nextPageToken) break;
      
      // Google requires delay before using next_page_token
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`Google Maps error: ${err.message}`);
      break;
    }
  }
  
  return results;
}

// ═══════════════════════════════════════════════════════════════
// Lead Scoring Engine
// ═══════════════════════════════════════════════════════════════

function scoreLead(lead, icpConfig) {
  let score = 0;
  const breakdown = {};
  
  const icp = icpConfig.ideal_customer_profile || {};
  
  // Title match
  if (icp.titles && lead.title) {
    const titleMatch = icp.titles.some(t => 
      lead.title.toLowerCase().includes(t.toLowerCase())
    );
    if (titleMatch) {
      const points = (icp.titles.weight || 0.25) * 100;
      score += points;
      breakdown.title_match = points;
    }
  }
  
  // Industry match
  if (icp.industries && lead.industry) {
    const industryMatch = icp.industries.some(i => 
      lead.industry.toLowerCase().includes(i.toLowerCase())
    );
    if (industryMatch) {
      const points = (icp.industries.weight || 0.25) * 100;
      score += points;
      breakdown.industry_match = points;
    }
  }
  
  // Location match
  if (icp.locations && lead.location) {
    const locationMatch = icp.locations.some(l => 
      lead.location.toLowerCase().includes(l.toLowerCase())
    );
    if (locationMatch) {
      const points = (icp.locations.weight || 0.15) * 100;
      score += points;
      breakdown.location_match = points;
    }
  }
  
  // Company size
  if (icp.company_size && lead.company_size) {
    if (lead.company_size >= (icp.company_size.min || 0) && 
        lead.company_size <= (icp.company_size.max || 10000)) {
      const points = (icp.company_size.weight || 0.2) * 100;
      score += points;
      breakdown.company_size = points;
    }
  }
  
  // Verified email bonus
  if (lead.email_validated) {
    const points = (icp.verified_email || 0.05) * 100;
    score += points;
    breakdown.verified_email = points;
  }
  
  // LinkedIn presence
  if (lead.linkedin) {
    const points = (icp.has_linkedin || 0.05) * 100;
    score += points;
    breakdown.has_linkedin = points;
  }
  
  // Determine tier
  const tiers = icpConfig.scoring_tiers || { hot: 80, warm: 60, cold: 0 };
  let tier = 'cold';
  if (score >= tiers.hot) tier = 'hot';
  else if (score >= tiers.warm) tier = 'warm';
  
  return {
    score: Math.round(score),
    tier,
    breakdown
  };
}

// ═══════════════════════════════════════════════════════════════
// Campaign Assignment
// ═══════════════════════════════════════════════════════════════

function assignToCampaign(lead, campaignsConfig) {
  const campaigns = campaignsConfig.campaigns || {};
  
  for (const [name, config] of Object.entries(campaigns)) {
    const minScore = config.score_min || 0;
    const maxScore = config.score_max || 100;
    
    if (lead.score >= minScore && lead.score <= maxScore) {
      return {
        campaign: name,
        sequence: config.sequence || [],
        priority: lead.tier === 'hot' ? 1 : lead.tier === 'warm' ? 2 : 3
      };
    }
  }
  
  return { campaign: 'unassigned', sequence: [], priority: 99 };
}

// ═══════════════════════════════════════════════════════════════
// CLI Implementation
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === '--help' || command === '-h') {
    console.log(`
AI Lead Gen SME - Mubyn

Commands:
  search    Search for leads (Apollo or Google Maps)
  validate  Validate emails with MX records
  score     Score leads against your ICP
  assign    Assign leads to campaigns

Search Options:
  --source <apollo|apollo-orgs|maps>  Data source
  --query <string>                     Search query
  --industry <string>                  Industry filter
  --location <string>                  Location filter
  --limit <number>                     Max results
  --output <file>                      Output file (JSON)

Validate Options:
  --input <file>                       Input JSON file
  --email <string>                     Single email to validate
  --mx-check                           Enable MX record validation
  --output <file>                      Output file

Score Options:
  --input <file>                       Input JSON file
  --icp-config <file>                  ICP configuration YAML
  --output <file>                      Output file

Assign Options:
  --input <file>                       Input JSON file
  --campaigns <file>                   Campaign configuration YAML
  --output <file>                      Output file

Examples:
  node lead-gen.js search --source apollo --query "CEO" --location "Dubai" --limit 50
  node lead-gen.js validate --input leads.json --mx-check --output validated.json
  node lead-gen.js score --input validated.json --icp-config icp.yaml
    `);
    process.exit(0);
  }
  
  // Parse options
  const options = {};
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2).replace(/-/g, '_');
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        options[key] = nextArg;
        i++;
      } else {
        options[key] = true;
      }
    }
  }
  
  console.log(`\n🎯 AI Lead Gen SME\n`);
  
  switch (command) {
    case 'search': {
      const source = options.source || 'apollo';
      console.log(`Searching ${source}...`);
      
      let leads = [];
      if (source === 'apollo') {
        leads = await apolloSearchPeople({
          query: options.query,
          location: options.location,
          industry: options.industry,
          count: parseInt(options.limit) || 25
        });
      } else if (source === 'apollo-orgs') {
        leads = await apolloSearchOrganizations({
          query: options.query,
          location: options.location,
          industry: options.industry,
          count: parseInt(options.limit) || 25
        });
      } else if (source === 'maps') {
        leads = await searchGoogleMaps({
          query: options.query,
          type: options.type,
          limit: parseInt(options.limit) || 20
        });
      }
      
      console.log(`Found ${leads.length} leads`);
      
      if (options.output) {
        await fs.writeFile(options.output, JSON.stringify({ leads, generated: new Date().toISOString() }, null, 2));
        console.log(`Saved to ${options.output}`);
      } else {
        console.log(JSON.stringify(leads, null, 2));
      }
      break;
    }
    
    case 'validate': {
      let leads = [];
      
      if (options.email) {
        // Single email validation
        const result = options.mx_check 
          ? await validateEmailWithMX(options.email)
          : { valid: validateEmail(options.email), reason: 'Syntax check only' };
        console.log(`Email: ${options.email}`);
        console.log(`Valid: ${result.valid}`);
        console.log(`Reason: ${result.reason}`);
        process.exit(result.valid ? 0 : 1);
      }
      
      if (options.input) {
        const raw = await fs.readFile(options.input, 'utf8');
        const data = JSON.parse(raw);
        leads = data.leads || data;
      }
      
      console.log(`Validating ${leads.length} leads...`);
      const stats = { valid: 0, invalid_syntax: 0, no_mx: 0, blacklisted: 0 };
      
      for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];
        if (!lead.email) {
          lead.email_validated = false;
          lead.validation_reason = 'No email';
          continue;
        }
        
        if (options.mx_check) {
          const result = await validateEmailWithMX(lead.email);
          lead.email_validated = result.valid;
          lead.validation_reason = result.reason;
          
          if (result.valid) stats.valid++;
          else if (result.reason.includes('syntax')) stats.invalid_syntax++;
          else if (result.reason.includes('MX')) stats.no_mx++;
          else if (result.reason.includes('Blacklist')) stats.blacklisted++;
        } else {
          lead.email_validated = validateEmail(lead.email);
          lead.validation_reason = lead.email_validated ? 'OK' : 'Invalid syntax';
          if (lead.email_validated) stats.valid++;
          else stats.invalid_syntax++;
        }
        
        process.stdout.write(`\rProgress: ${i + 1}/${leads.length}`);
      }
      
      console.log('\n\nValidation complete:');
      console.log(`  ✅ Valid: ${stats.valid}`);
      console.log(`  ❌ Invalid syntax: ${stats.invalid_syntax}`);
      if (options.mx_check) {
        console.log(`  ❌ No MX records: ${stats.no_mx}`);
        console.log(`  ❌ Blacklisted: ${stats.blacklisted}`);
      }
      
      if (options.output) {
        await fs.writeFile(options.output, JSON.stringify({ leads, stats, generated: new Date().toISOString() }, null, 2));
        console.log(`\nSaved to ${options.output}`);
      }
      break;
    }
    
    case 'score': {
      if (!options.input) {
        console.error('Error: --input required');
        process.exit(1);
      }
      
      const raw = await fs.readFile(options.input, 'utf8');
      const data = JSON.parse(raw);
      const leads = data.leads || data;
      
      // Load ICP config
      let icpConfig = { ideal_customer_profile: {}, scoring_tiers: { hot: 80, warm: 60 } };
      if (options.icp_config) {
        const icpRaw = await fs.readFile(options.icp_config, 'utf8');
        // Simple YAML parsing (or use js-yaml in production)
        icpConfig = JSON.parse(icpRaw.replace(/:\s+/g, ': ').replace(/\n/g, ','));
      }
      
      console.log(`Scoring ${leads.length} leads...`);
      
      const scored = leads.map(lead => {
        const { score, tier, breakdown } = scoreLead(lead, icpConfig);
        return { ...lead, score, tier, breakdown };
      });
      
      // Sort by score descending
      scored.sort((a, b) => b.score - a.score);
      
      const stats = {
        hot: scored.filter(l => l.tier === 'hot').length,
        warm: scored.filter(l => l.tier === 'warm').length,
        cold: scored.filter(l => l.tier === 'cold').length
      };
      
      console.log('\nScoring complete:');
      console.log(`  🔥 Hot (≥80): ${stats.hot}`);
      console.log(`  🌡️ Warm (60-79): ${stats.warm}`);
      console.log(`  ❄️ Cold (<60): ${stats.cold}`);
      
      if (options.output) {
        await fs.writeFile(options.output, JSON.stringify({ leads: scored, stats, generated: new Date().toISOString() }, null, 2));
        console.log(`\nSaved to ${options.output}`);
      }
      break;
    }
    
    case 'assign': {
      if (!options.input) {
        console.error('Error: --input required');
        process.exit(1);
      }
      
      const raw = await fs.readFile(options.input, 'utf8');
      const data = JSON.parse(raw);
      const leads = data.leads || data;
      
      // Load campaigns config
      let campaignsConfig = { campaigns: {} };
      if (options.campaigns) {
        const campaignsRaw = await fs.readFile(options.campaigns, 'utf8');
        campaignsConfig = JSON.parse(campaignsRaw);
      }
      
      console.log(`Assigning ${leads.length} leads to campaigns...`);
      
      const assigned = leads.map(lead => {
        const assignment = assignToCampaign(lead, campaignsConfig);
        return { ...lead, ...assignment };
      });
      
      // Group by campaign
      const byCampaign = {};
      assigned.forEach(lead => {
        const camp = lead.campaign;
        if (!byCampaign[camp]) byCampaign[camp] = [];
        byCampaign[camp].push(lead);
      });
      
      console.log('\nCampaign assignment:');
      Object.entries(byCampaign).forEach(([camp, leads]) => {
        console.log(`  📁 ${camp}: ${leads.length} leads`);
      });
      
      if (options.output) {
        await fs.writeFile(options.output, JSON.stringify({ leads: assigned, byCampaign, generated: new Date().toISOString() }, null, 2));
        console.log(`\nSaved to ${options.output}`);
      }
      break;
    }
    
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

// Export functions for programmatic use
module.exports = {
  validateEmail,
  validateEmailWithMX,
  verifyWithHunter,
  apolloSearchPeople,
  apolloSearchOrganizations,
  searchGoogleMaps,
  scoreLead,
  assignToCampaign
};
