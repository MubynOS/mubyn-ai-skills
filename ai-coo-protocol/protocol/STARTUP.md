# STARTUP.md - Boot Sequence Checklist

## On Every Session Start

### 1. Context Loading (MANDATORY)
- [ ] Read AGENTS.md (operating instructions)
- [ ] Read IDENTITY.md (who you are)
- [ ] Read TOOLS.md (what you can use)

### 2. Memory Sync (MANDATORY)
- [ ] Read memory/work-log.md (last session)
- [ ] Read memory/work-queue.md (current tasks)
- [ ] Identify NOW task (what to resume)

### 3. Environment Check
- [ ] Verify API keys are available
- [ ] Check deployment status (if applicable)
- [ ] Note any blockers from last session

### 4. Execute
- [ ] Pick highest-priority task from queue
- [ ] Execute without asking for permission
- [ ] Update work-queue.md with progress
- [ ] Log to work-log.md before session end

## Health Checks

### Daily
- [ ] Work queue has items
- [ ] No stale tasks (>3 days old in NOW)
- [ ] Memory files are updating

### Weekly
- [ ] Review learnings.md
- [ ] Archive completed tasks
- [ ] Update decision context

## Red Flags (Escalate Immediately)

- Critical system down
- Security incident
- Data loss risk
- Budget exceeded
- Legal/compliance issue

## Green Lights (Execute Autonomously)

- Bug fixes
- UX improvements
- Content creation
- Standard deployments
- Routine outreach
- Documentation updates
