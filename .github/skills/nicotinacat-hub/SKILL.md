---
name: nicotinacat-hub
description: "Use when developing, revising, or reviewing the Nicotinacat Hub project. Covers brand identity, dark gothic game UI, arcade progression work, architecture preservation, and validation of frontend changes for the nicotinacat universe."
argument-hint: "analyze the current implementation and update a feature while preserving the nicotinacat identity, architecture, and game progression logic"
user-invocable: true
disable-model-invocation: false
---

# Nicotinacat Hub Development Skill

## When to Use
- Updating branding, pages, components, arcades, or game systems in the Nicotinacat Hub project
- Reviewing whether a design choice matches the nicotinacat universe
- Fixing a bug or feature addition without breaking the existing product architecture
- Preparing UI changes across Home, Live, Clips, Community, Profile, Arcade, Wishlist, Auth, Privacy, Terms, and notifications

## Mission
Build and evolve a digital universe that feels unmistakably like nicotinacat: dark, gothic, anime-inspired, premium, and grounded in gaming culture without becoming a generic purple template or corporate SaaS dashboard.

## Brand Rules
- Always write the brand as nicotinacat, never as Nicotina Cat, nicotina cat, NicotinaCat, or other variants.
- Keep the interface predominantly dark with black, graphite, deep blue-black, and violet undertones.
- Use #A855F7 as the primary accent, but do not flood the whole interface with neon purple.
- Use Cinzel for titles and identity elements; use a modern sans-serif for functional text.
- Keep a skull/caveira motif as a recognizable signature, but do not over-decorate.
- Favor depth, noise, layered layouts, glow, cinematic lighting, and 3D-driven moments in strategic places such as Arcade.
- Preserve a premium, dark fantasy, goth-metal, RPG-inspired identity.

## Core Product Direction
- Home is the brand entry point and must immediately communicate “this is nicotinacat”.
- Arcade is a primary pillar: RPG + idle progression + cards + collection + rewards + deck-building.
- Community, Profile, Wishlist, Live, and Clips should feel like parts of the same universe, not separate template pages.
- Preserve navigation consistency and page identity across the Hub.
- Support loading, empty, error, offline, unauthenticated, and authenticated states everywhere relevant.

## Required Workflow

### 1. Locate and Understand
Before editing code:
- Identify the exact files and components involved.
- Read the existing implementation instead of assuming the architecture.
- Check how the feature fits into the current app structure, route layout, and data flow.
- Confirm whether the request impacts brand UI, game logic, data contracts, or both.

### 2. Preserve Existing Contracts
- Do not replace existing patterns with a new generic approach unless there is a direct need.
- Reuse existing components and logic instead of duplicating similar structures under different names.
- Preserve the current app behaviour, navigation, and typed data contracts unless the task explicitly requires a compatible change.

### 3. Apply Decision Principles
Use these decisions during implementation:
- If the work affects the brand identity, lean toward darker, more cinematic, more premium styling.
- If the work affects the Arcade, preserve progression logic and collectible identity.
- If the work adds visual effects, keep them strategic and intentional; do not turn the whole screen into an effects demo.
- If the work impacts responsiveness, adapt layouts for mobile and tablet instead of simply shrinking desktop layouts.
- If the work touches accessibility, maintain contrast, focus states, keyboard navigation, labels, and click targets.

### 4. Implement the Minimum Safe Change
- Change only what is needed for the request.
- Keep the existing architecture and app flow intact.
- Avoid broad refactors or large unrelated rewrites.
- Favor targeted edits that preserve functionality and visual continuity.

### 5. Validate Before Completion
After the change:
- Check TypeScript/build health with the project’s relevant verification commands.
- Review visual behavior in core pages and responsive states.
- Check for regressions in navigation, feedback, and identity consistency.
- Make sure loading, empty, error, and offline states still behave gracefully.

## Quality Criteria
The work is considered complete only if all of these are true:
- The design clearly feels like nicotinacat and not a generic purple theme.
- Existing functionality remains intact unless the task deliberately changes it.
- The UI respects current architecture and data flow.
- The work still reads as premium and intentional rather than template-generated.
- Core pages remain usable, readable, and accessible.
- A responsive view is tested for mobile/tablet/desktop behavior.
- The implementation includes graceful handling for missing data, offline states, and failed integrations.

## Formatting and Design Guardrails
Avoid:
- generic SaaS dashboard layouts
- corporate-looking design patterns
- overuse of rounded cards and glassmorphism
- excessive neon purple
- childish or toy-like visuals
- copying protected franchise elements
- inconsistent naming or brand variations

Prefer:
- layered composition, subtle parallax, overlays, depth, and cinematic light
- 3D elements in strategic Arcade contexts
- clean but dark premium interfaces
- animation and materials that support the universe rather than distract from it

## Progression and Game Logic Rules
- Preserve the project’s XP progression formula: floor(100 × 1.5^(level - 1)).
- Keep the user progression model consistent across level, XP, rewards, and Arcade systems.
- Do not weaken or replace the progression logic without explicit justification.
- Maintain the concept of cards, deck building, inventory, expeditions, rewards, and offline progression as core game loops.

## Completion Checklist
Before finishing any task, confirm:
1. The requested change is implemented with minimal scope.
2. Brand identity remains aligned with nicotinacat.
3. Existing behavior and contracts are preserved.
4. No unrelated refactors were introduced.
5. Build/type validation has been run and reviewed.
6. Responsive and accessibility checks were considered.
7. The final result is described clearly in terms of changed files, what changed, preserved functionality, verification performed, and known limitations.

## Final Principle
Treat the project as a living universe, not as a generic website theme. Every decision should contribute to the premium, memorable nicotinacat experience: streaming, community, RPG progression, cards, collection, identity, and cinematic dark fantasy.
