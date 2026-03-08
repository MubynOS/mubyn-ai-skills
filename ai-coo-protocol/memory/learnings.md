# Learnings

Accumulated wisdom from operations. Update during RARAR cycles.

---

## Technical

### Deployment
- [Platform] deployments need [X] minutes for cold starts
- Always run tests before deploying (scripts/test.sh)
- Blue-green deployments reduce downtime risk

### APIs
- [API Name] rate limit: [X]/min — use exponential backoff
- [Service] API keys rotate every [X] days
- Always cache responses when possible

### Code
- [Framework] hot reload breaks on [condition]
- [Language] async patterns to prefer: [pattern]
- Testing saves more time than it costs

---

## Business

### Sales
- [Customer segment] responds best to [channel]
- [Day/time] gets highest engagement
- [Objection] countered by [response]

### Marketing
- [Content type] performs best on [platform]
- [Hashtag strategy] for [market]
- Video content outperforms static by [X]%

### Operations
- [Process] takes [time] on average
- [Automation] saves [hours]/week
- [Bottleneck] is the constraint

---

## Process

### What Works
- Update work-queue BEFORE ending session
- Log everything — if not logged, didn't happen
- Break complex tasks into <30 min chunks

### What Doesn't Work
- Trying to do everything at once
- Skipping the boot sequence
- Not logging blockers

### Patterns
- [Pattern name]: [description]
- [Anti-pattern]: [why to avoid]

---

## Decisions (Reference)

### [Category]
- Decision: [what]
- Rationale: [why]
- Date: YYYY-MM-DD
- Status: Active/Superseded

---

*Last RARAR cycle: YYYY-MM-DD HH:MM*
