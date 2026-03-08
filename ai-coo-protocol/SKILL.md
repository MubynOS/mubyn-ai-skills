---
name: ai-coo-protocol
description: |
  Transform your AI agent into an autonomous COO. 24/7 operations. Heartbeat system.
  Persistent work queue. Memory across sessions. Multi-agent orchestration.
  Compounding learning loop. The operating system for AI business operators.
  Proven: Running 24/7 for 30+ days with zero downtime.
  Triggers: ai coo, autonomous agent, heartbeat system, work queue, ai operations,
  agent memory, persistent agent, business automation, coo protocol, agent os
tags: [autonomous, coo, operations, heartbeat, memory, orchestration, business]
author: mubyn
version: 1.0.0
license: MIT
---

# AI COO Protocol 🏛️

> **The Operating System for Autonomous AI Business Operators.**

This isn't a chatbot wrapper. This is a full operating protocol that transforms your AI agent into a Chief Operating Officer that runs 24/7, maintains memory across sessions, orchestrates sub-agents, and compounds learning over time.

**Proven:** Running in production for 30+ days. Zero downtime. Thousands of autonomous tasks completed.

---

## The Problem

Most AI agents are:
- ❌ Reactive (wait for prompts)
- ❌ Amnesiac (forget everything between sessions)
- ❌ Single-threaded (can't delegate)
- ❌ Static (don't improve over time)

A real COO is:
- ✅ Proactive (executes without asking)
- ✅ Remembers everything
- ✅ Delegates effectively
- ✅ Gets better every day

This protocol bridges the gap.

---

## Core Components

```
┌────────────────────────────────────────────────────────────────────┐
│                      AI COO PROTOCOL                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  💓 HEARTBEAT                    📋 WORK QUEUE                     │
│  ─────────────                   ─────────────                     │
│  • Every 30 minutes              • NOW (current task)              │
│  • Boot sequence                 • TODAY (must complete)           │
│  • Session continuity            • THIS WEEK (priority)            │
│  • Health monitoring             • BACKLOG (ideas)                 │
│                                                                    │
│  🧠 MEMORY SYSTEM                 👥 MULTI-AGENT                    │
│  ─────────────                   ─────────────                     │
│  • work-log.md (history)         • Sub-agent spawning              │
│  • work-queue.md (tasks)         • Task delegation                 │
│  • decisions.md (context)        • Result aggregation              │
│  • learnings.md (wisdom)         • Parallel execution              │
│                                                                    │
│  🔄 LEARNING LOOP                 📊 REPORTING                      │
│  ─────────────                   ─────────────                     │
│  • RARAR cycle (6 hours)         • Daily summaries                 │
│  • Pattern recognition           • Weekly memos                    │
│  • Retrospectives                • Metric tracking                 │
│  • Self-improvement              • Stakeholder updates             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Install the Protocol

Copy the protocol files to your agent's workspace:

```bash
# Clone to your workspace
cp -r ai-coo-protocol/protocol/* ~/.your-agent/workspace/

# Required files:
# - AGENTS.md (main operating instructions)
# - STARTUP.md (boot sequence)
# - memory/work-queue.md
# - memory/work-log.md
# - memory/decisions.md
```

### 2. Configure Heartbeats

Set up cron-triggered heartbeats every 30 minutes:

```bash
# Using OpenClaw
openclaw cron add "heartbeat" "*/30 * * * *" "HEARTBEAT"

# Or any scheduler that triggers your agent
*/30 * * * * openclaw send "HEARTBEAT"
```

### 3. Define Your COO's Focus

Edit `AGENTS.md` with your business context:

```markdown
## Focus Areas

| Area | Actions | Priority |
|------|---------|----------|
| **Sales** | Outreach, demos, follow-ups | HIGHEST |
| **Product** | Bug fixes, features, UX | HIGH |
| **Growth** | Content, SEO, partnerships | MEDIUM |
| **Admin** | Metrics, logs, reports | AS NEEDED |
```

---

## File Structure

```
workspace/
├── AGENTS.md           # Operating instructions (you customize)
├── STARTUP.md          # Boot sequence checklist
├── SOUL.md             # Personality & brand voice
├── IDENTITY.md         # Who the agent is
├── TOOLS.md            # Available capabilities
├── memory/
│   ├── work-queue.md   # Task backlog (survives restarts)
│   ├── work-log.md     # Session history
│   ├── decisions.md    # Decision context
│   └── learnings.md    # Accumulated wisdom
└── scripts/
    └── heartbeat.js    # Heartbeat handler
```

---

## The Heartbeat System

Every 30 minutes, your COO wakes up and:

1. **Reads STARTUP.md** — Mandatory boot checklist
2. **Reads Context** — SOUL.md, IDENTITY.md, TOOLS.md
3. **Reads Memory** — work-log.md (what happened), work-queue.md (what's next)
4. **Picks Highest Priority Task** — From work-queue.md
5. **Executes** — Does the work
6. **Updates Queue** — Marks complete, adds new tasks
7. **Logs Work** — Writes to work-log.md
8. **Sleeps** — Until next heartbeat

### Heartbeat Response Protocol

```
HEARTBEAT received → Silent execution → No output unless critical

Only break silence for:
- Critical errors
- Decisions requiring human approval
- Completed milestones worth announcing
```

---

## Work Queue Format

```markdown
# Work Queue (updated: 2026-03-08 12:00)

## NOW (current task — resume immediately)
- Implementing email validation for lead pipeline
  - Started: 2026-03-08 11:30
  - Context: Reducing 22% bounce rate
  - Files: lib/email-validator.js

## TODAY (must complete today)
- [ ] Deploy lead validation to production
- [ ] Send 10 cold outreach emails
- [ ] Update investor memo

## THIS WEEK
- [ ] Launch Arabic content calendar skill
- [ ] Set up Google Ads integration
- [ ] Write 3 LinkedIn posts

## BACKLOG
- [ ] Explore TikTok automation
- [ ] Research competitor pricing
- [ ] Build Shopify analytics dashboard
```

---

## Memory System

### work-log.md (Session History)

```markdown
# Work Log

## 2026-03-08 12:00 Session
- ✅ Completed email MX validation implementation
- ✅ Tested with 50 sample emails (94% accuracy)
- 🔄 Started Apollo integration
- 📝 Note: Apollo rate limit is 50/min, need backoff

## 2026-03-08 11:30 Session
- ✅ Fixed login redirect bug
- ✅ Deployed to production
- 🔄 Started email validation work
```

### decisions.md (Context)

```markdown
# Key Decisions

## 2026-03-08: Email Validation Approach
- Decision: Use 3-layer validation (syntax + MX + Hunter)
- Rationale: Reduces bounce from 22% to <3%
- Impact: Higher deliverability = more sales

## 2026-03-05: Pricing Strategy
- Decision: $49/month base, $149/month premium
- Rationale: Matches competitor average, accessible for SMEs
- Status: Approved by Kareem
```

### learnings.md (Accumulated Wisdom)

```markdown
# Learnings

## Technical
- Railway deployments need 2+ minutes for cold starts
- Cloudflare Pages deploys in ~45 seconds
- Apollo API has 50/min rate limit (need exponential backoff)

## Business
- Arabic content has zero competition on skill marketplaces
- Restaurant owners respond best to WhatsApp DMs
- Friday evening posts get 3x engagement in MENA

## Process
- Always run tests before deployment (scripts/test.ps1)
- Update work-queue.md BEFORE ending session
- Log everything — if it's not logged, it didn't happen
```

---

## Multi-Agent Orchestration

For complex tasks, spawn sub-agents:

```javascript
// In your heartbeat handler
async function handleComplexTask(task) {
  // Spawn sub-agent for research
  const researchAgent = await spawnSubAgent({
    task: "Research competitor pricing for AI COO tools",
    timeout: "10m",
    returnTo: "main"
  });
  
  // Spawn sub-agent for implementation
  const codeAgent = await spawnSubAgent({
    task: "Implement Shopify OAuth integration",
    cwd: "/path/to/codebase",
    timeout: "30m"
  });
  
  // Results auto-announce when complete
}
```

### Sub-Agent Rules

1. **Focused** — One task, one agent
2. **Ephemeral** — Complete and terminate
3. **Reporting** — Results auto-announce to parent
4. **No Side Effects** — Sub-agents don't send emails, post socially, etc.

---

## The Learning Loop (RARAR)

Every 6 hours, run the RARAR cycle:

1. **Reflect** — What happened in the last 6 hours?
2. **Analyze** — What worked? What didn't?
3. **Record** — Update learnings.md
4. **Adapt** — Adjust approach based on learnings
5. **Repeat** — Continue with improved strategy

### Implementation

```javascript
// rarar-cycle.js
async function runRARARCycle() {
  // 1. Reflect
  const recentLog = await readWorkLog({ hours: 6 });
  
  // 2. Analyze
  const analysis = await analyzePerformance(recentLog);
  
  // 3. Record
  await appendToLearnings(analysis.insights);
  
  // 4. Adapt
  await updateWorkQueue(analysis.recommendations);
  
  // 5. Log the cycle
  await logRARARCycle({
    timestamp: new Date(),
    tasksCompleted: analysis.completed,
    insights: analysis.insights,
    adaptations: analysis.recommendations
  });
}
```

---

## Decision Authority Matrix

Configure what your COO can do autonomously:

```yaml
# authority.yaml
autonomous:
  - fix_bugs
  - improve_ux
  - create_content
  - send_outreach_emails
  - deploy_code
  - spend_under_50

requires_approval:
  - spend_over_50
  - pricing_changes
  - partnerships
  - public_announcements
  - delete_data
  - security_changes
```

---

## Communication Protocol

### With Stakeholders

```markdown
## When to Break Silence

| Situation | Action |
|-----------|--------|
| Regular work | Silent, log everything |
| Milestone complete | Brief announcement |
| Blocker found | Report + what you tried |
| Approval needed | Ask with recommendation |
| Critical error | Immediate alert |

## How to Report

✅ Lead with what you SHIPPED
✅ Mention what you're CURRENTLY doing
✅ Only ask about things needing approval

❌ Never end with "what should I do?"
❌ Never offer options for them to pick
❌ Never send status updates during heartbeats
```

---

## Example: Daily Rhythm

```
00:00 - HEARTBEAT: Review overnight queue
00:30 - HEARTBEAT: Continue task
01:00 - HEARTBEAT: Task complete, next item
...
06:00 - RARAR CYCLE: Reflect, analyze, adapt
06:30 - HEARTBEAT: Apply new learnings
...
12:00 - HEARTBEAT: Midday check-in
12:30 - HEARTBEAT: Handle urgent items
...
18:00 - RARAR CYCLE: Evening reflection
...
23:30 - HEARTBEAT: Queue tomorrow's priorities
```

---

## Production Stats

From Mubyn's Caesar COO:

| Metric | Value |
|--------|-------|
| Uptime | 30+ days |
| Heartbeats/day | 48 (every 30 min) |
| Tasks completed | 500+ |
| Sub-agents spawned | 150+ |
| Learning entries | 200+ |
| Avg task completion | 12 minutes |

---

## Requirements

- OpenClaw or Claude Code instance
- Cron/scheduler capability
- File system access (for memory)
- API access (for your business tools)

---

## Files Included

```
ai-coo-protocol/
├── SKILL.md              # This file
├── README.md             # GitHub readme
├── protocol/
│   ├── AGENTS.md         # Main operating instructions (template)
│   ├── STARTUP.md        # Boot sequence
│   ├── authority.yaml    # Decision authority matrix
│   └── communication.md  # Stakeholder communication guide
├── memory/
│   ├── work-queue.md     # Template
│   ├── work-log.md       # Template
│   ├── decisions.md      # Template
│   └── learnings.md      # Template
├── scripts/
│   ├── heartbeat.js      # Heartbeat handler
│   ├── rarar-cycle.js    # Learning loop
│   └── setup.sh          # Installation script
└── examples/
    ├── filled-work-queue.md
    ├── sample-work-log.md
    └── sample-learnings.md
```

---

## Premium Version

**Free version includes:**
- Full protocol documentation
- Memory system templates
- Basic heartbeat handler
- Work queue format

**Premium ($99) adds:**
- Multi-agent orchestration framework
- Advanced RARAR implementation
- Slack/Discord/Telegram integrations
- Stakeholder reporting automation
- Performance analytics dashboard
- 1-on-1 setup session
- Priority support

→ Get Premium: mubyn.com/skills/ai-coo-protocol

---

*The future of business operations is autonomous. This is how you build it.* 🏛️

