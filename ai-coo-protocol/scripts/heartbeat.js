#!/usr/bin/env node
/**
 * Heartbeat Handler for AI COO Protocol
 * 
 * Triggered every 30 minutes by cron. Manages session continuity,
 * task execution, and memory persistence.
 * 
 * @author Mubyn (mubyn.com)
 * @license MIT
 */

const fs = require('fs').promises;
const path = require('path');

const WORKSPACE = process.env.COO_WORKSPACE || process.cwd();
const MEMORY_DIR = path.join(WORKSPACE, 'memory');

// ═══════════════════════════════════════════════════════════════
// Memory Operations
// ═══════════════════════════════════════════════════════════════

async function readMemoryFile(filename) {
  try {
    return await fs.readFile(path.join(MEMORY_DIR, filename), 'utf8');
  } catch {
    return null;
  }
}

async function writeMemoryFile(filename, content) {
  await fs.mkdir(MEMORY_DIR, { recursive: true });
  await fs.writeFile(path.join(MEMORY_DIR, filename), content);
}

async function appendToWorkLog(entry) {
  const logPath = path.join(MEMORY_DIR, 'work-log.md');
  let existing = '';
  try {
    existing = await fs.readFile(logPath, 'utf8');
  } catch {}
  
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const newEntry = `\n## ${timestamp} Session\n${entry}\n`;
  
  // Insert after "# Work Log" header
  const headerEnd = existing.indexOf('\n\n');
  if (headerEnd > 0) {
    const updated = existing.slice(0, headerEnd + 2) + newEntry + existing.slice(headerEnd + 2);
    await fs.writeFile(logPath, updated);
  } else {
    await fs.appendFile(logPath, newEntry);
  }
}

// ═══════════════════════════════════════════════════════════════
// Work Queue Parsing
// ═══════════════════════════════════════════════════════════════

function parseWorkQueue(content) {
  const sections = {
    now: null,
    today: [],
    thisWeek: [],
    backlog: []
  };
  
  if (!content) return sections;
  
  let currentSection = null;
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('## NOW')) {
      currentSection = 'now';
    } else if (trimmed.startsWith('## TODAY')) {
      currentSection = 'today';
    } else if (trimmed.startsWith('## THIS WEEK')) {
      currentSection = 'thisWeek';
    } else if (trimmed.startsWith('## BACKLOG')) {
      currentSection = 'backlog';
    } else if (trimmed.startsWith('## Completed')) {
      currentSection = null; // Skip completed section
    } else if (trimmed.startsWith('- ') && currentSection) {
      const task = trimmed.slice(2);
      if (currentSection === 'now') {
        sections.now = task;
      } else if (!task.startsWith('[x]')) {
        sections[currentSection].push(task);
      }
    }
  }
  
  return sections;
}

function updateWorkQueue(content, updates) {
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  
  // Update timestamp in header
  let updated = content.replace(
    /# Work Queue \(updated:.*\)/,
    `# Work Queue (updated: ${timestamp})`
  );
  
  // Apply updates
  if (updates.completeNow) {
    // Move NOW task to completed
    updated = updated.replace(/## NOW[\s\S]*?(?=## TODAY)/, `## NOW (current task — resume this immediately)\n- [No active task]\n\n`);
  }
  
  if (updates.newNow) {
    updated = updated.replace(
      /## NOW[\s\S]*?(?=## TODAY)/,
      `## NOW (current task — resume this immediately)\n- ${updates.newNow}\n  - Started: ${timestamp}\n\n`
    );
  }
  
  return updated;
}

// ═══════════════════════════════════════════════════════════════
// Heartbeat Execution
// ═══════════════════════════════════════════════════════════════

async function runHeartbeat() {
  console.log('💓 Heartbeat starting...');
  const startTime = Date.now();
  
  // 1. Load memory
  const workQueue = await readMemoryFile('work-queue.md');
  const workLog = await readMemoryFile('work-log.md');
  const learnings = await readMemoryFile('learnings.md');
  
  if (!workQueue) {
    console.log('⚠️ No work-queue.md found. Creating template.');
    await writeMemoryFile('work-queue.md', getQueueTemplate());
    return { status: 'initialized', message: 'Work queue created' };
  }
  
  // 2. Parse current state
  const queue = parseWorkQueue(workQueue);
  
  // 3. Determine action
  const result = {
    timestamp: new Date().toISOString(),
    currentTask: queue.now,
    todayTasks: queue.today.length,
    weekTasks: queue.thisWeek.length,
    action: null,
    duration: 0
  };
  
  if (queue.now && !queue.now.includes('[No active task]')) {
    result.action = 'continue';
    console.log(`🔄 Continuing: ${queue.now.split('\n')[0]}`);
  } else if (queue.today.length > 0) {
    result.action = 'start_today';
    const nextTask = queue.today[0].replace('[ ] ', '');
    console.log(`▶️ Starting: ${nextTask}`);
    
    // Update queue with new NOW task
    const updatedQueue = updateWorkQueue(workQueue, { newNow: nextTask });
    await writeMemoryFile('work-queue.md', updatedQueue);
  } else if (queue.thisWeek.length > 0) {
    result.action = 'start_week';
    const nextTask = queue.thisWeek[0].replace('[ ] ', '');
    console.log(`▶️ Starting from week: ${nextTask}`);
  } else if (queue.backlog.length > 0) {
    result.action = 'backlog';
    console.log(`📋 Backlog items available: ${queue.backlog.length}`);
  } else {
    result.action = 'idle';
    console.log('✅ All tasks complete. Queue is empty.');
  }
  
  // 4. Log the heartbeat
  const logEntry = `- 💓 Heartbeat at ${new Date().toLocaleTimeString()}
- Action: ${result.action}
- Current: ${queue.now ? queue.now.split('\n')[0] : 'None'}`;
  
  await appendToWorkLog(logEntry);
  
  result.duration = Date.now() - startTime;
  console.log(`💓 Heartbeat complete (${result.duration}ms)`);
  
  return result;
}

// ═══════════════════════════════════════════════════════════════
// Templates
// ═══════════════════════════════════════════════════════════════

function getQueueTemplate() {
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  return `# Work Queue (updated: ${timestamp})

## NOW (current task — resume this immediately)
- [No active task]

## TODAY (must complete today)
- [ ] Add your first task here

## THIS WEEK
- [ ] Weekly task 1
- [ ] Weekly task 2

## BACKLOG (ideas, low priority)
- [ ] Future idea 1
- [ ] Future idea 2

---

## Completed (archive weekly)
`;
}

// ═══════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════

if (require.main === module) {
  runHeartbeat()
    .then(result => {
      // Silent output for cron (HEARTBEAT_OK)
      if (process.env.VERBOSE) {
        console.log(JSON.stringify(result, null, 2));
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Heartbeat error:', err.message);
      process.exit(1);
    });
}

module.exports = { runHeartbeat, parseWorkQueue, updateWorkQueue };
