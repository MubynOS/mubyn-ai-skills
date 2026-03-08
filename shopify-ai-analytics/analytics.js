#!/usr/bin/env node
/**
 * Shopify AI Analytics
 * 
 * Pull data from Shopify API. Generate AI-powered insights.
 * 
 * @author Mubyn (mubyn.com)
 * @license MIT
 */

const fs = require('fs').promises;

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || '';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const API_VERSION = '2024-01';

// ═══════════════════════════════════════════════════════════════
// Shopify API Client
// ═══════════════════════════════════════════════════════════════

class ShopifyClient {
  constructor(store, accessToken) {
    this.store = store;
    this.accessToken = accessToken;
    this.baseUrl = `https://${store}/admin/api/${API_VERSION}`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!res.ok) {
      throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams({
      status: 'any',
      limit: 250,
      ...params
    }).toString();
    return this.request(`/orders.json?${queryString}`);
  }

  async getProducts(params = {}) {
    const queryString = new URLSearchParams({
      limit: 250,
      ...params
    }).toString();
    return this.request(`/products.json?${queryString}`);
  }

  async getCustomers(params = {}) {
    const queryString = new URLSearchParams({
      limit: 250,
      ...params
    }).toString();
    return this.request(`/customers.json?${queryString}`);
  }

  async getInventoryLevels(locationId) {
    return this.request(`/inventory_levels.json?location_ids=${locationId}&limit=250`);
  }
}

// ═══════════════════════════════════════════════════════════════
// Analytics Engine
// ═══════════════════════════════════════════════════════════════

class ShopifyAnalytics {
  constructor(options = {}) {
    this.client = new ShopifyClient(
      options.store || SHOPIFY_STORE,
      options.accessToken || SHOPIFY_ACCESS_TOKEN
    );
    this.openaiKey = options.openaiKey || OPENAI_API_KEY;
  }

  // ─── Revenue Analytics ─────────────────────────────────────────
  
  async getRevenue(options = {}) {
    const { period = 'last_30_days', breakdown = ['daily'] } = options;
    
    const dateRange = this.getDateRange(period);
    const { orders } = await this.client.getOrders({
      created_at_min: dateRange.start.toISOString(),
      created_at_max: dateRange.end.toISOString()
    });

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const orderCount = orders.length;
    const aov = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Daily breakdown
    const dailyRevenue = {};
    orders.forEach(order => {
      const date = order.created_at.split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + parseFloat(order.total_price || 0);
    });

    // Find best/worst days
    const days = Object.entries(dailyRevenue).sort((a, b) => b[1] - a[1]);
    const bestDay = days[0] || ['N/A', 0];
    const worstDay = days[days.length - 1] || ['N/A', 0];

    return {
      period,
      dateRange: { start: dateRange.start.toISOString(), end: dateRange.end.toISOString() },
      total: Math.round(totalRevenue * 100) / 100,
      orders: orderCount,
      aov: Math.round(aov * 100) / 100,
      bestDay: { date: bestDay[0], revenue: bestDay[1] },
      worstDay: { date: worstDay[0], revenue: worstDay[1] },
      dailyBreakdown: dailyRevenue
    };
  }

  // ─── Product Performance ───────────────────────────────────────
  
  async getProductPerformance(options = {}) {
    const { period = 'last_30_days', limit = 20 } = options;
    
    const dateRange = this.getDateRange(period);
    const [{ orders }, { products }] = await Promise.all([
      this.client.getOrders({
        created_at_min: dateRange.start.toISOString(),
        created_at_max: dateRange.end.toISOString()
      }),
      this.client.getProducts()
    ]);

    // Aggregate product sales
    const productSales = {};
    orders.forEach(order => {
      (order.line_items || []).forEach(item => {
        const id = item.product_id;
        if (!productSales[id]) {
          productSales[id] = {
            product_id: id,
            title: item.title,
            units: 0,
            revenue: 0
          };
        }
        productSales[id].units += item.quantity;
        productSales[id].revenue += parseFloat(item.price || 0) * item.quantity;
      });
    });

    // Sort by revenue
    const sorted = Object.values(productSales).sort((a, b) => b.revenue - a.revenue);
    const topPerformers = sorted.slice(0, limit);
    const underperformers = sorted.filter(p => p.revenue < 100);

    return {
      period,
      totalProducts: products.length,
      productsWithSales: sorted.length,
      topPerformers,
      underperformers: underperformers.slice(0, 10)
    };
  }

  // ─── Customer Segmentation (RFM) ───────────────────────────────
  
  async getCustomerSegments(options = {}) {
    const { period = 'last_90_days' } = options;
    
    const dateRange = this.getDateRange(period);
    const { orders } = await this.client.getOrders({
      created_at_min: dateRange.start.toISOString(),
      financial_status: 'paid'
    });

    // Build customer profiles
    const customers = {};
    const now = new Date();
    
    orders.forEach(order => {
      const customerId = order.customer?.id;
      if (!customerId) return;
      
      if (!customers[customerId]) {
        customers[customerId] = {
          id: customerId,
          email: order.customer?.email,
          orders: [],
          totalSpent: 0
        };
      }
      customers[customerId].orders.push(new Date(order.created_at));
      customers[customerId].totalSpent += parseFloat(order.total_price || 0);
    });

    // Calculate RFM scores
    const rfmScores = Object.values(customers).map(customer => {
      const orderDates = customer.orders.sort((a, b) => b - a);
      const recency = Math.floor((now - orderDates[0]) / (1000 * 60 * 60 * 24)); // Days since last order
      const frequency = orderDates.length;
      const monetary = customer.totalSpent;

      return {
        ...customer,
        recency,
        frequency,
        monetary,
        segment: this.getRFMSegment(recency, frequency, monetary)
      };
    });

    // Group by segment
    const segments = {
      champions: rfmScores.filter(c => c.segment === 'champions'),
      loyal: rfmScores.filter(c => c.segment === 'loyal'),
      promising: rfmScores.filter(c => c.segment === 'promising'),
      at_risk: rfmScores.filter(c => c.segment === 'at_risk'),
      lost: rfmScores.filter(c => c.segment === 'lost')
    };

    const summary = {};
    for (const [seg, customers] of Object.entries(segments)) {
      summary[seg] = {
        count: customers.length,
        totalRevenue: Math.round(customers.reduce((s, c) => s + c.monetary, 0) * 100) / 100,
        avgOrder: customers.length > 0 
          ? Math.round(customers.reduce((s, c) => s + c.monetary, 0) / customers.length * 100) / 100 
          : 0
      };
    }

    return {
      period,
      totalCustomers: Object.keys(customers).length,
      segments: summary,
      details: segments
    };
  }

  getRFMSegment(recency, frequency, monetary) {
    // Simple segmentation logic
    if (recency < 30 && frequency >= 3 && monetary > 300) return 'champions';
    if (recency < 60 && frequency >= 2 && monetary > 150) return 'loyal';
    if (recency < 90 && frequency >= 1) return 'promising';
    if (recency >= 90 && recency < 180 && frequency >= 1) return 'at_risk';
    return 'lost';
  }

  // ─── AI Insights ───────────────────────────────────────────────
  
  async getAIInsights(options = {}) {
    const { minConfidence = 0.70, minImpact = 100 } = options;

    // Gather data for analysis
    const [revenue, products, customers] = await Promise.all([
      this.getRevenue({ period: 'last_30_days' }),
      this.getProductPerformance({ period: 'last_30_days' }),
      this.getCustomerSegments({ period: 'last_90_days' })
    ]);

    // Generate AI insights
    const insights = await this.generateInsights({
      revenue,
      products,
      customers,
      minConfidence,
      minImpact
    });

    return {
      generated: new Date().toISOString(),
      dataPeriod: 'last_30_days',
      insights,
      summary: {
        totalInsights: insights.length,
        totalPotentialImpact: insights.reduce((s, i) => s + (i.impact?.monthly || 0), 0)
      }
    };
  }

  async generateInsights(data) {
    if (!this.openaiKey) {
      return this.generateBasicInsights(data);
    }

    const prompt = `You are an e-commerce analyst. Analyze this Shopify data and provide actionable insights.

DATA:
Revenue: $${data.revenue.total} (${data.revenue.orders} orders, AOV: $${data.revenue.aov})
Top Products: ${data.products.topPerformers.slice(0, 5).map(p => `${p.title}: $${p.revenue}`).join(', ')}
Customer Segments: Champions: ${data.customers.segments.champions?.count || 0}, At-Risk: ${data.customers.segments.at_risk?.count || 0}

Provide 3-5 specific, actionable insights in JSON format:
[
  {
    "type": "pricing|inventory|marketing|product",
    "title": "Brief title",
    "description": "What you observed",
    "recommendation": "Specific action to take",
    "impact": { "monthly": 500, "confidence": 0.85 }
  }
]`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content || '[]';
      const match = content.match(/\[[\s\S]*\]/);
      return match ? JSON.parse(match[0]) : this.generateBasicInsights(data);
    } catch (err) {
      console.error('AI insights error:', err.message);
      return this.generateBasicInsights(data);
    }
  }

  generateBasicInsights(data) {
    const insights = [];

    // Low AOV insight
    if (data.revenue.aov < 50) {
      insights.push({
        type: 'marketing',
        title: 'Low average order value',
        description: `Your AOV is $${data.revenue.aov}, which is below industry average`,
        recommendation: 'Implement upselling or free shipping threshold',
        impact: { monthly: data.revenue.total * 0.1, confidence: 0.75 }
      });
    }

    // At-risk customers
    const atRisk = data.customers.segments.at_risk?.count || 0;
    if (atRisk > 20) {
      insights.push({
        type: 'marketing',
        title: 'At-risk customer segment',
        description: `${atRisk} customers haven't purchased in 90+ days`,
        recommendation: 'Launch win-back email campaign with 15% discount',
        impact: { monthly: atRisk * 25, confidence: 0.70 }
      });
    }

    // Top product momentum
    const topProduct = data.products.topPerformers[0];
    if (topProduct && topProduct.revenue > data.revenue.total * 0.2) {
      insights.push({
        type: 'product',
        title: 'Star product opportunity',
        description: `${topProduct.title} drives ${Math.round(topProduct.revenue / data.revenue.total * 100)}% of revenue`,
        recommendation: 'Consider creating variations or bundles',
        impact: { monthly: topProduct.revenue * 0.15, confidence: 0.80 }
      });
    }

    return insights;
  }

  // ─── Reports ───────────────────────────────────────────────────
  
  async generateReport(type = 'daily') {
    const [revenue, products, customers, insights] = await Promise.all([
      this.getRevenue({ period: type === 'daily' ? 'last_7_days' : 'last_30_days' }),
      this.getProductPerformance({ period: type === 'daily' ? 'last_7_days' : 'last_30_days', limit: 10 }),
      this.getCustomerSegments({ period: 'last_90_days' }),
      this.getAIInsights()
    ]);

    const report = {
      type,
      generated: new Date().toISOString(),
      store: this.client.store,
      revenue,
      products,
      customers,
      insights: insights.insights
    };

    // Generate markdown version
    const markdown = this.formatReportMarkdown(report);
    report.markdown = markdown;

    return report;
  }

  formatReportMarkdown(report) {
    const emoji = report.type === 'daily' ? '☀️' : '📊';
    return `# ${emoji} ${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Analytics Report
**Store:** ${report.store}
**Generated:** ${new Date(report.generated).toLocaleString()}

## 📈 Revenue

| Metric | Value |
|--------|-------|
| Total Revenue | $${report.revenue.total.toLocaleString()} |
| Orders | ${report.revenue.orders} |
| AOV | $${report.revenue.aov} |
| Best Day | ${report.revenue.bestDay.date} ($${report.revenue.bestDay.revenue}) |

## 🏆 Top Products

${report.products.topPerformers.slice(0, 5).map((p, i) => 
  `${i + 1}. **${p.title}** — $${p.revenue.toLocaleString()} (${p.units} units)`
).join('\n')}

## 👥 Customer Segments

| Segment | Count | Revenue |
|---------|-------|---------|
${Object.entries(report.customers.segments).map(([seg, data]) =>
  `| ${seg.charAt(0).toUpperCase() + seg.slice(1)} | ${data.count} | $${data.totalRevenue.toLocaleString()} |`
).join('\n')}

## ⚡ AI Insights

${report.insights.map((insight, i) => 
  `### ${i + 1}. ${insight.title}
${insight.description}

**Recommendation:** ${insight.recommendation}
**Potential Impact:** $${insight.impact?.monthly || 'N/A'}/month`
).join('\n\n')}

---
*Generated by Shopify AI Analytics — Mubyn*
`;
  }

  // ─── Helpers ───────────────────────────────────────────────────
  
  getDateRange(period) {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'last_7_days':
        start.setDate(end.getDate() - 7);
        break;
      case 'last_30_days':
        start.setDate(end.getDate() - 30);
        break;
      case 'last_90_days':
        start.setDate(end.getDate() - 90);
        break;
      default:
        start.setDate(end.getDate() - 30);
    }

    return { start, end };
  }
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(`
Shopify AI Analytics — Mubyn

Commands:
  daily       Generate daily report
  weekly      Generate weekly report
  revenue     Revenue analytics
  products    Product performance
  customers   Customer segmentation
  insights    AI recommendations

Options:
  --output <file>    Output file (JSON)
  --format <type>    Output format (json, markdown)

Examples:
  node analytics.js daily
  node analytics.js products --top 20
  node analytics.js insights --format markdown
`);
    process.exit(0);
  }

  // Check credentials
  if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    console.error('Error: SHOPIFY_STORE and SHOPIFY_ACCESS_TOKEN required');
    process.exit(1);
  }

  const analytics = new ShopifyAnalytics();
  let result;

  console.log(`\n📊 Shopify AI Analytics\n`);

  try {
    switch (command) {
      case 'daily':
      case 'weekly':
        console.log(`Generating ${command} report...`);
        result = await analytics.generateReport(command);
        if (args.includes('--format') && args[args.indexOf('--format') + 1] === 'markdown') {
          console.log(result.markdown);
        } else {
          console.log(JSON.stringify(result, null, 2));
        }
        break;

      case 'revenue':
        console.log('Fetching revenue analytics...');
        result = await analytics.getRevenue({ period: 'last_30_days' });
        console.log(JSON.stringify(result, null, 2));
        break;

      case 'products':
        console.log('Analyzing product performance...');
        result = await analytics.getProductPerformance({ period: 'last_30_days' });
        console.log(JSON.stringify(result, null, 2));
        break;

      case 'customers':
        console.log('Segmenting customers...');
        result = await analytics.getCustomerSegments({ period: 'last_90_days' });
        console.log(JSON.stringify(result, null, 2));
        break;

      case 'insights':
        console.log('Generating AI insights...');
        result = await analytics.getAIInsights();
        console.log(JSON.stringify(result, null, 2));
        break;

      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }

    // Save to file if requested
    const outputIdx = args.indexOf('--output');
    if (outputIdx > -1 && args[outputIdx + 1]) {
      await fs.writeFile(args[outputIdx + 1], JSON.stringify(result, null, 2));
      console.log(`\nSaved to ${args[outputIdx + 1]}`);
    }

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ShopifyAnalytics, ShopifyClient };
