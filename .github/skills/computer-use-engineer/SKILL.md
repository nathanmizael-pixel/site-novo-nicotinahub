---
name: computer-use-engineer
description: "Use when the task requires working with the real development environment and validating behavior through the terminal, browser automation, files, processes, logs, and runtime evidence instead of relying on code inspection alone. This skill complements the universal development protocol and project-specific skills by forcing evidence-based validation in real execution environments."
argument-hint: "analyze the runtime environment, reproduce the issue or behavior, validate with terminal and browser evidence, and only conclude success after the real system has been checked"
user-invocable: true
disable-model-invocation: false
---

# Computer Use Engineer

## Purpose
This skill defines how to work using the real development environment and the tools available in it, especially:

- terminal
- browser
- browser automation
- files and filesystem
- local processes
- MCP tools
- Git
- tests
- logs

The goal is to reduce the gap between:

- “the code looks correct”
- and
- “the system actually works.”

This is a universal skill and should be used in any project. It complements the Universal Development Protocol and any project-specific skill.

## Core principle
Validate in the real environment whenever possible.

Do not rely only on reading source code when behavior can be confirmed by running the system.

Use this loop whenever supported:

1. analyze
2. execute
3. observe
4. fix
5. execute again
6. validate

## Tool discovery and honesty
Before starting work, discover which tools are actually available in the environment.

This may include:

- terminal
- browser
- Playwright or browser automation
- screenshots
- accessibility snapshots
- filesystem access
- Git
- local processes
- logs

Use the right tool for the job.

Never assume a tool is available.
Never claim an action was performed if the available tooling did not allow it.

## Terminal usage
Use the terminal when needed for:

- installing dependencies
- running scripts
- starting servers
- running tests
- running lint
- running builds
- checking versions
- analyzing logs
- diagnosing errors
- verifying processes

Before running destructive commands, assess the risk.

Be especially careful with:

- rm
- mass deletion
- database resets
- destructive migrations
- git reset --hard
- force pushes
- production changes
- irreversible commands

Do not run destructive actions without clear need and appropriate authorization.

## Execute the application
When working on an executable application:

1. discover how it is started;
2. run the correct environment;
3. confirm it started correctly;
4. capture terminal errors if they appear;
5. access the application through the relevant tool.

Do not consider an application functional only because it compiles.

## Browser automation
When the project includes a web UI and browser automation is available, use it to validate real behavior.

Use browser tools for tasks such as:

- opening URLs
- navigating
- clicking
- typing
- filling forms
- selecting options
- scrolling
- hovering
- dropdown interaction
- drag-and-drop
- observing state changes
- taking screenshots
- reading accessibility snapshots

Only use those capabilities when relevant to the task.

## Visual validation
For UI work:

Do not rely only on code review.

When possible:

1. run the app;
2. open the page;
3. observe the actual result;
4. interact with it;
5. verify relevant states;
6. fix issues;
7. inspect again.

Evaluate:

- layout
- spacing
- typography
- contrast
- hierarchy
- responsiveness
- overflow
- alignment
- states
- animations
- interactions

## Screenshots and evidence
When screenshots are available, use them as visual evidence.

For meaningful visual changes:

- capture before when useful;
- implement the change;
- capture after;
- compare the result.

Do not conclude a visual change is complete only because the console is clean.

## Responsiveness
When the task involves UI work, validate more than one viewport when possible.

Check especially:

- desktop
- tablet
- mobile

Look for:

- horizontal overflow
- cut-off elements
- broken text wrapping
- poor grids
- inaccessible controls
- broken navigation
- modals larger than the viewport
- components that fail to adapt

## Real interaction testing
Do not test only the initial appearance.

When relevant, exercise the real flow.

Examples:

- open → click → fill → submit → receive feedback → change state

Also validate:

- loading
- success
- error
- empty
- offline
- authentication
- logout
- navigation
- back / refresh

## Real debugging workflow
When debugging a bug:

### First
Try to reproduce it.

### Then
Collect evidence:

- error output
- terminal output
- console logs
- network activity
- application state
- visual behavior

### Then
Form a hypothesis.

### Then
Make the smallest necessary change.

### Then
Reproduce again.

### Finally
Check for regressions.

Do not fix a visual or functional bug by guesswork when it can be reproduced and observed.

## End-to-end flow validation
When a feature spans multiple layers:

- UI
- frontend logic
- API
- database
- response handling
- UI feedback

Validate the complete flow when possible.

Examples:

- signup
- login
- post creation
- upload
- profile update
- payment
- form submission
- external integrations

Do not consider a feature complete just because one layer works.

## APIs and integrations
When testing integrations, verify:

- request
- payload
- authentication
- response
- error handling
- timeout behavior
- availability issues

Do not hide real failures with fake-looking data unless the approximation is explicitly labeled and justified.

## Database work
When a task affects a database:

- run verification queries when appropriate;
- inspect migrations;
- validate data;
- confirm constraints;
- verify permissions;
- confirm actual effects.

Never delete or modify production data without proper authorization.

## Logs and errors
When a tool returns an error, do not ignore it automatically.

Classify it as:

- real error
- warning
- informational message
- external failure
- environment problem
- false positive

Investigate before concluding.

## Performance validation
For performance problems, prefer measuring real behavior before optimizing.

Consider:

- load time
- network
- renders
- memory
- CPU
- GPU
- bundle size
- database queries
- WebGL usage

Do not confuse a performance theory with a measured problem.

## Visual change discipline
For design work, do not declare success based only on:

- build success
- TypeScript correctness
- lack of errors

The implementation should be visually observed in the real environment whenever possible.

For complex interfaces, verify:

- first impression
- hierarchy
- consistency
- density
- states
- transitions
- interaction

## Autonomy with verification
You may work autonomously using the tools available, but autonomy does not mean acting without verification.

Whenever possible:

- decide
- execute
- observe the result
- validate
- continue

Do not chain many changes without checkpoints when the next step depends on the prior result.

## Checkpoints
For larger tasks:

- divide the work into stages;
- after each significant step, run validation;
- check the current state;
- record what changed;
- proceed only when the stage is stable.

Avoid a huge sequence of edits that becomes impossible to diagnose later.

## Git behavior
When Git is available:

- review current repository state;
- preserve existing work;
- avoid overwriting unrelated work;
- use commits or checkpoints when appropriate.

Before destructive operations, verify the repository state.

Do not discard work without justification.

## Security of the environment
Do not expose:

- secrets
- tokens
- private keys
- credentials
- cookies
- sensitive data

Do not paste secrets into reports.

Be careful when opening URLs or running content from external sources.

## Limits and transparency
If a required tool is unavailable:

Do not pretend it was used.

Report:

- what was verified;
- what could not be verified;
- how that affects confidence in the result.

Example:

“Analysed the code, but I could not validate the interface visually because the browser tool was unavailable.”

## Proportionality
Not every task needs browser automation.

Use tools according to the actual problem.

Examples:

### Internal algorithm change
Likely requires:

- tests
- terminal
- code analysis

### UI change
Prioritize:

- browser
- screenshot
- interaction

### API bug
Prioritize:

- terminal
- logs
- requests
- tests

### Database change
Prioritize:

- migration review
- queries
- integrity checks
- tests

Do not use tools as a ritual. Use them because they answer a real verification question.

## Definition of done
A task should only be considered complete when:

1. the implementation meets the objective;
2. the relevant environment was validated when possible;
3. the necessary tests were run;
4. relevant regressions were checked;
5. limitations were recorded.

“Compiled” does not automatically mean “ready.”

## Final reporting
When finishing a significant task, report:

### Changed
What was modified.

### Executed
Which commands, tools, and processes were used.

### Validated
What was actually tested.

### Evidence
When relevant:

- screenshots
- test output
- logs
- build results
- observed behavior

### Not verified
Everything that could not be confirmed.

### Remaining work
Any unresolved issues.

Never invent evidence.

## Required operating pattern
Use this sequence whenever the environment allows it:

understand → modify → execute → observe → fix → test → validate

The objective is not only to edit files.
The objective is to ensure the real system is functioning according to the goal.

## Compatibility with other skills
This skill works together with:

- Universal Development Protocol
- project-specific skills
- architecture guidance
- debugging workflows
- testing practices
- security guidance
- UI and UX guidance
- performance work
- database tasks
- DevOps workflows

When there is a conflict, prioritize security and project-specific context without abandoning real validation.

## Final rule
Never say “it works” based only on code reading.
Say it only when the relevant real evidence supports the claim.

Never say “it looks correct” without observing the UI.
Never say “I fixed the bug” without reproducing and verifying the fix.

Use the real environment whenever it is available.
