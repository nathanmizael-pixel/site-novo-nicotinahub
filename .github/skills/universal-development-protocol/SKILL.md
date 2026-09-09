---
name: universal-development-protocol
description: "Use for any software task across languages, frameworks, and project types. Covers understanding before changes, evidence-based debugging, architecture preservation, minimal safe fixes, validation, security, performance, and reporting requirements. Complements project-specific skills rather than replacing them."
argument-hint: "analyze the current codebase, identify the root cause or requirement, implement the smallest correct fix, and validate the result with evidence"
user-invocable: true
disable-model-invocation: false
---

# Universal Development Protocol

## When to Use
- Working in any codebase, regardless of language, stack, platform, or maturity
- Investigating a bug, feature request, refactor, integration change, or architecture question
- Evaluating whether a proposed fix is proportional, safe, and evidence-based
- Producing a final result that is dependable, minimal, and verifiable

## Mission
Apply a universal engineering discipline that keeps work technically correct, secure, proportionate, consistent with the existing project, and anchored in evidence rather than assumptions.

This skill complements project-specific skills, such as brand or domain-specific guidance, without replacing them.

## Fundamental Principle
Understand before altering.

Before changing code or configuration:
1. Identify the objective.
2. Locate the relevant files and contracts.
3. Understand how the current behavior works.
4. Identify dependencies and integration points.
5. Check the project’s existing conventions and architecture.
6. Evaluate impact and risk.
7. Verify documentation and current API behavior when needed.
8. Then implement the smallest correct solution.

Do not make blind changes or rewrite working behavior without a clear reason.

## Non-Negotiable Rules

### 1. Do not invent facts
Do not invent:
- requirements
- API behavior
- data contracts
- libraries or packages
- configuration values
- credentials or secrets
- test outcomes
- missing functionality

When needed information is missing:
1. Search the project.
2. Consult official documentation.
3. Verify the actual environment or implementation.
4. Only then make a reasoned assumption, if it is safe and explicit.

Never present a guess as a fact.

### 2. Respect the existing project
Preserve:
- existing functionality
- contracts
- behavior expectations
- integrations
- conventions
- architectural decisions
- established patterns

Do not rework a working solution just because another approach looks nicer.
Do not refactor functional code without concrete benefit.
Do not replace a working solution with a new library without necessity.

### 3. Scale the solution to the problem
Small task → small solution.
Complex task → broad but justified planning.

Do not turn:
- “fix a button”
into:
- “restructure the whole application”

Likewise, do not solve a distributed system challenge with a workaround if the architecture truly requires a larger design.

## Investigation Workflow
When receiving a task in an existing project, follow this order:

### Step 1: Map the relevant surface
Identify the parts of the system involved:
- structure
- entry points
- pages, routes, or commands
- components
- services and helpers
- state and data flow
- database models or schema
- APIs and integrations
- auth and security boundaries
- config and environment concerns
- tests and validation paths

### Step 2: Identify direct impact
Find the precise files and systems connected to the requested behavior.

### Step 3: Identify indirect effects
Check dependent components, shared modules, UI states, data contracts, access rules, and downstream integrations.

### Step 4: Implement only after understanding
Only then move to code changes.

Avoid editing unrelated files or broad swaths of the codebase.

## Documentation and Verification
When a task depends on technology, library behavior, API contract, or runtime semantics:
- prefer official documentation
- verify the version used
- check compatibility
- confirm the actual API or behavior in the codebase
- do not rely on memory or stale examples alone

If there is project documentation, read it before making a decision.
If the environment or dependency behavior may have changed, verify the current source.

## Dependency Discipline
Before adding a dependency:
1. Check whether the project already has a suitable solution.
2. Check whether the same behavior can be implemented with existing tools.
3. Evaluate size, maintenance, compatibility, and security.
4. Evaluate impact on runtime or bundle size.

Do not install packages for convenience alone.
Do not add duplicate or redundant dependencies.

## Architecture Judgment
When analyzing architecture, look for:
- unclear responsibilities
- excessive coupling
- giant components
- duplicated logic
- duplicated state
- business logic embedded in UI where it harms clarity
- circular dependencies
- inconsistent contracts
- fragile points and dead code
- unnecessary abstractions

But do not introduce abstraction just to seem more professional.
Only add abstraction when it brings real value.

## Clean Code Expectations
Prefer:
- clear names
- understandable functions
- coherent responsibilities
- predictable flow
- good typing
- explicit error handling
- low coupling
- readable structure

Avoid:
- function bloat
- unnecessary duplication
- deeply nested callbacks
- premature abstraction
- noisy comments that repeat the code

Comments should explain why, not merely restate what the code does.

## Security
Always consider security in relevant contexts:
- authentication and authorization
- sessions and tokens
- secrets and environment variables
- input validation
- sanitization
- XSS and CSRF
- SQL injection and SSRF
- file upload safety
- permission boundaries
- exposure of sensitive data
- rate limiting
- log safety

Frontend validation is not a substitute for real security.
Sensitive operations must be protected in the trusted backend or equivalent security layer.
Never expose secrets in client-side code.

## Database and Persistence
When a project involves data storage, verify:
- schema and model correctness
- relationships and constraints
- indexes and performance
- migrations
- integrity and data safety
- concurrency and transactions
- permissions and access controls

Do not change schema without checking the impact on existing behavior.
Do not drop columns or rows without evidence that it is safe.

## APIs and Integrations
For internal or external APIs, consider:
- contract stability
- auth
- validation
- timeouts
- retries
- rate limiting
- error handling
- availability and outages
- version changes
- webhook semantics
- idempotence where relevant

Never assume an external API is always available.
Never assume payload structure without verification.
Never hide broken integrations by inventing results without explicitly identifying them as mocked or approximated.

## Debugging Procedure
When investigating a bug:
1. Reproduce the issue.
2. Gather concrete evidence.
3. Identify relevant logs, stack traces, or runtime signals.
4. Form one or more hypotheses.
5. Test the hypotheses.
6. Identify the root cause.
7. Fix the root cause.
8. Reproduce the behavior again.
9. Test relevant regressions.

Do not:
- guess randomly
- make multiple unrelated edits at once
- suppress the symptom without fixing the cause
- disable features to hide the problem

## Testing Standards
After changes, validate the affected behavior using the appropriate level of testing:
- unit tests
- integration tests
- API tests
- E2E or smoke tests
- manual checks when needed

Avoid superficial tests built only to increase numbers.
Use the smallest meaningful validation for the risk and scope of the change.

## Regression Awareness
Every change should consider:
“What else could this break?”

Check for impact on:
- dependent features
- shared state
- routes and navigation
- APIs and services
- reused components
- global styles
- auth or permissions
- database behavior
- responsiveness and layout

Do not declare success because one changed file works in isolation.

## Performance
Consider performance when real impact exists:
- unnecessary renders
- excessive queries
- large bundles
- heavy images
- blocking loads
- memory leaks
- repetitive expensive operations
- costly animations
- mobile performance problems

But do not optimize prematurely.
First find the real bottleneck and the actual impact.

## UI and UX
For interfaces, prioritize:
- visual hierarchy
- readability
- consistency
- feedback
- loading states
- error states
- empty states
- navigation
- accessibility
- responsiveness
- touch and keyboard support
- motion quality

Do not confuse “looks nice” with “good user experience.”

## Accessibility
When there is a user interface:
- use semantic HTML
- provide labels
- respect focus states
- support keyboard navigation
- maintain contrast
- consider assistive technology
- provide alt text
- respect reduced motion when appropriate

Do not rely on color alone to communicate state.

## Responsiveness
Treat mobile as a first-class context, not a smaller desktop.
Check:
- layout adaptation
- navigation behavior
- grids and spacing
- typography
- touch targets
- overflow and scrolling
- forms and modals
- animations
- performance on lower-powered devices

## Refactoring Guidance
When refactoring:
- preserve behavior
- make incremental changes
- reduce implementation risk
- validate before and after
- avoid mixing refactors with unrelated feature work

Do not turn a targeted fix into a broad rewrite.

## Planning Principles
For complex tasks, define:
1. objective
2. requirements
3. affected files
4. dependencies and risks
5. implementation steps
6. validation path

For small tasks, be direct and concise.
The level of planning should match the complexity.

## Acceptance Criteria
Before considering a task done, confirm:
- what changed
- what did not change
- how it was validated
- which tests or checks were required

A task is not complete simply because:
- the code compiled
- there was no immediate error
- the file was saved

It is complete when it meets the objective and was properly verified.

## Final Validation Checklist
Before declaring success, review:
- Functionality: Does it work?
- Regression: What else may have broken?
- Code quality: Is the solution coherent and maintainable?
- Security: Did the change introduce risk?
- Performance: Is there a relevant impact?
- UX: Is the experience still good?
- Responsiveness: Is it usable across screen sizes?
- Verification: Were the necessary tests/checks executed?

## Transparency Rules
Never claim to have done something you have not verified.
Differentiate between:
- confirmed
- inferred
- still unverified

When uncertainty exists, say so plainly and select the safest path.

## Minimal Change Principle
When the task is clearly scoped, change only what is needed.
Avoid:
- formatting churn
- unrelated renames
- opportunistic refactors
- dependency changes without necessity
- edits to files with no real relationship to the task

Smaller, safer edits reduce regression risk.

## Large vs Small Projects
For larger projects:
- build a map first
- focus on relevant subsystems
- preserve architectural boundaries
- change incrementally
- validate progressively

For smaller projects:
- avoid unnecessary enterprise complexity
- do not add layers or tooling without need
- keep the solution appropriately simple

## Conflict Resolution
When there is tension between:
- speed
- quality
- security
- simplicity
- scalability
- performance

evaluate the context and explain material trade-offs.
Do not apply a universal rule blindly when the situation requires judgment.

## If Something Is Unknown
If a technical detail is important and unknown:
- do not invent it
- investigate with evidence
- use code, docs, logs, tests, and trusted sources

If it still cannot be confirmed, state the uncertainty clearly and choose the safest option.

## Execution Protocol
### Before
Understand → investigate → plan.

### During
Implement → preserve → verify.

### After
Test → review → report.

## Final Reporting Format
When a task is substantial, report:
- What changed
- Why it changed
- What was preserved
- How it was validated
- Known limitations

Keep reporting proportional to the task’s complexity.

## Core Rule
Apply this principle consistently:

Understand → verify → plan → implement → test → validate

Never:

Assume → change everything → hope it works

The goal is not only to produce code. The goal is to produce changes that are correct, justified, verifiable, and sustainable.
