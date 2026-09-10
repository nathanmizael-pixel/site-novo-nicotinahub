---
name: universal-development-guard-hook
description: "Automatic safety and validation layer for any project. Reinforces the Universal Development Protocol and Computer Use Engineer by enforcing analysis before changes, minimal scoped edits, and evidence-based verification before completion."
argument-hint: "inspect the current workspace and git state, identify impacted files, make the smallest safe change, validate with the relevant checks, and only finish with evidence"
user-invocable: true
disable-model-invocation: false
---

# Universal Development Guard Hook

## Purpose
This hook acts as an automatic safety and validation layer for any project. It reinforces the existing skills:

- Universal Development Protocol
- Computer Use Engineer

Its purpose is to prevent the pattern:

alterar → build passou → pronto

and to enforce the correct sequence:

analisar → alterar → executar → observar → testar → validar

## Core principle
The agent must always follow:

ENTENDER → ALTERAR → VALIDAR → TESTAR → VERIFICAR

Never consider a task complete simply because code was changed.

## Before changes
Before significant edits:

- verify the current workspace state;
- verify Git state when available;
- preserve existing work;
- identify potentially affected files;
- avoid destructive operations;
- verify relevant context and dependencies.

Do not discard existing work.

Do not use destructive operations without explicit and safe need, such as:

- git reset --hard
- git clean -fd
- force push
- mass deletions

## After changes
Whenever code changes:

- review the diff;
- look for unrelated changes;
- check syntax/type errors when relevant;
- run the appropriate project validation.

When available, use:

- typecheck;
- lint;
- tests;
- build.

Do not run irrelevant commands just to satisfy a checklist.

## UI changes
When a task changes the interface:

- run the application when possible;
- use browser automation when available;
- check the real page;
- verify responsiveness when relevant;
- check the console;
- validate interactive behavior when needed.

Never claim a visual change is correct only because the source code looks right when the browser is available.

## Bugs
When the task is a bug fix:

1. try to reproduce;
2. collect evidence;
3. identify the cause;
4. apply the smallest correct fix;
5. reproduce again;
6. validate the regression.

Do not hide symptoms to make the error disappear.

## Dependencies
Before installing a dependency:

- check whether the project already has a solution;
- verify the actual need;
- consider compatibility;
- consider security;
- consider impact.

Do not install unnecessary dependencies.

## Git
When Git is available:

- preserve existing changes;
- verify the diff before committing;
- avoid unrelated files;
- never include secrets;
- never force push automatically.

If a significant task is completed, a checkpoint or commit may be created when appropriate.

## Secrets
Never add to version control:

- .env
- tokens
- API keys
- passwords
- credentials
- private certificates
- cookies
- sensitive information

If a secret is found accidentally, do not expose it in the report.

## Errors and limitations
If validation cannot be executed:

- report the limitation;
- do not pretend it was executed;
- do not declare success without enough evidence.

Differentiate clearly between:

- confirmed
- not verified

## Completion criteria
Before considering a task complete, confirm:

- objective achieved;
- changes are coherent;
- appropriate tests were run;
- relevant regressions were checked;
- Git state was reviewed when applicable.

If the task cannot be fully validated, state that explicitly.

## Final rule
This hook exists to prevent the weak workflow:

alterar → build passou → pronto

and strengthen the disciplined flow:

analisar → alterar → executar → observar → testar → validar

Automation must be proportional to the task.

Do not block simple work with unnecessary process.

Do not let automation replace technical judgment.
