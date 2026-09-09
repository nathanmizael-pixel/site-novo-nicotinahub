# Nicotinacat Hub Project Rules

This repository is a Nicotinacat Hub project. Every agent working here must read the current project context before making any change.

## Required repository behavior
1. Read the project context and identify the affected files, routes, and shared contracts before editing.
2. Respect the existing universal engineering skill for this repository and the project-specific rules below.
3. Preserve existing behavior, interfaces, data contracts, and navigation unless a task explicitly calls for a compatible change.
4. Keep changes minimal, targeted, and consistent with the current product architecture.
5. Validate with the relevant project checks before claiming completion.
6. Do not invent integrations, API behavior, hidden requirements, or test outcomes.
7. Never declare success without evidence from verification.

## Identity
Official name: nicotinacat

Always write the brand as nicotinacat and never in alternate forms.

Identity characteristics:
- dark
- gothic
- anime
- dark fantasy
- gaming
- rock/metal
- underground
- mysterious
- modern
- premium

Primary accent color: #A855F7
Display typography: Cinzel or equivalent appropriate display serif
Brand motif: skull/caveira

## Visual direction
This project must not look like:
- SaaS template
- corporate dashboard
- generic gamer template
- AI-generated website aesthetic
- plain black + purple + cards without identity

The visual direction should favor:
- composition
- depth
- lighting
- texture
- noise
- shadows
- motion
- original graphical language
- 3D where it meaningfully improves the experience

Avoid overusing:
- glow
- glassmorphism
- gradients
- rounded cards
- effects without functional purpose

## 3D direction
3D is a future direction for the project and may be used selectively in areas where it meaningfully improves the experience.

Possible technologies:
- Three.js
- React Three Fiber
- Drei
- WebGL
- shaders
- particles
- lighting
- materials

3D should not be added only to impress. It must be evaluated for performance, accessibility, and fallback behavior.

## Current scope
The current product scope excludes the following areas:
- Arcade
- Live
- Clips

Do not expand, prioritize, or develop those areas as part of this task unless there is explicit instruction to do so.

Before removing or changing code related to those areas, verify if there is a shared dependency. Do not delete code indiscriminately.

## Main focus areas
The current focus should remain on:
- Home
- Community
- Profile
- Wishlist
- Notifications
- Auth
- Terms
- Privacy
- shared infrastructure and supporting features that sustain these areas

The scope may expand later only with explicit direction.

## Community
Community represents the nicotinacat community and should preserve and evolve:
- posts
- likes
- comments
- follows
- notifications
- profiles

New features should feel native to the project identity and not generic social-media clones.

## Profile
Profile should represent the user’s identity inside the nicotinacat universe. Prioritize:
- identity
- activity
- content
- statistics
- personalization
- community elements

## Wishlist
Wishlist represents the Amazon wishlist flow and should not be transformed into a standalone store.

Preserve the function of directing the user to the wishlist.

## Development rule for significant changes
Before:
- investigate
- locate
- understand
- evaluate impact
- plan

During:
- modify the minimum necessary
- preserve existing contracts
- maintain consistency

After:
- test
- validate
- review regressions
- review responsiveness

## Separation of concerns
This repository keeps two distinct layers of guidance:

### Universal Development Protocol
General engineering rules for any project. This lives in the universal skill and must remain separate from product-specific guidance.

### Nicotinacat Hub Project Rules
Project-specific rules for this product. This file is the workspace-level repository instruction for nicotinacat.

Do not mix the universal engineering rules with the product-specific identity and scope rules.

## Nemotron implementation guidance
The primary implementation agent for this repository will be NVIDIA Nemotron 3 Ultra. This agent should:
- analyze before altering
- follow the existing skills
- follow the project rules
- test before claiming success
- explain changes clearly
- avoid destructive or unnecessary modification

## No implementation in this task
This task is preparation-only. Do not:
- alter the UI
- alter the database
- alter authentication
- alter components
- install dependencies
- refactor code
- fix bugs
- implement new functionality

Only organize and register instructions/skills for future work.

## Verification requirement
Before completing any future task, the agent must validate using the project’s relevant checks and report the evidence. This repository’s standard validation is:
- npm run typecheck
- npm run build
- npm run lint

No completion claim is valid without verification output.
