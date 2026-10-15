---
id: F-010
title: Sort and pin results
status: draft
milestone: M-2
priority: P2
personas: [PER-01]
entities: [ENT-Preferences, ENT-CaseKind]
rules: [RULE-01, RULE-13, RULE-14]
screens: [SCR-Converter]
components: [CMP-Controls, CMP-ResultGrid, CMP-ResultRow]
nfr: [NFR-04]
events: []
depends_on: [F-002, F-003]
---

## Intent
Let the user bring the cases they use most to the top — by recent use, alphabetically, or by
pinning — and see at a glance which case they last copied, so repeated conversions are fast.

## Scope
- In: a sort control (default / recently copied / alphabetical); pinning cases to the top; a
  last-used badge on the most-recently-copied case; all remembered on the device (RULE-14).
- Out: reordering by drag; hiding cases; changing any result's text (order only, RULE-13).

## Requirements
- **R1** The user can choose a sort mode — default (RULE-01 order), recently copied, or
  alphabetical by label — and it is remembered (RULE-13, RULE-14).
- **R2** Copying a result (F-003) records its case as most-recently-used; in `recent` sort the
  grid reorders accordingly, most-recent first, cases never copied keeping RULE-01 order after
  them (RULE-13).
- **R3** The most-recently-used case shows a last-used badge (COPY-badge.last_used) on its row in
  every sort mode and across sessions, until another case is copied (RULE-13).
- **R4** The user can pin and unpin any case; pinned cases appear first, keeping the active sort
  within the pinned and the unpinned groups (RULE-13).
- **R5** Sorting, pinning and the badge change only row position and marking, never a result's
  text or the set of cases shown (INV-02, RULE-13).
- **R6** All of sort mode, pins and recent-use order are remembered on the device and restored on
  next open (RULE-14).

## Acceptance criteria
- **AC1** Given sort = default, when the user switches to alphabetical, then the rows are ordered by case label case-insensitively (camelCase, CONSTANT_CASE, dot.case, kebab-case, lowercase, PascalCase, path/case, Sentence case, snake_case, Title Case, UPPERCASE). (R1)
- **AC2** Given sort = recently copied and the user copies snake_case then kebab-case, when the grid reorders, then kebab-case is first, snake_case second, and the other nine follow in RULE-01 order. (R2)
- **AC3** Given the user copies snake_case, when the grid is shown in any sort mode, then the snake_case row shows COPY-badge.last_used and no other row does. (R3)
- **AC4** Given the user copies kebab-case after snake_case, when the grid updates, then the last-used badge is on kebab-case only. (R3)
- **AC5** Given the user pins path/case with sort = default, when the grid is shown, then path/case is the first row and the remaining ten keep RULE-01 order. (R4)
- **AC6** Given any sort or pin change, when the grid updates, then each case's result text is unchanged and all eleven cases are still present. (R5)
- **AC7** Given the user set sort = recently copied, pinned path/case, and copied snake_case, when they reopen the tool, then the sort, the pin and the last-used badge on snake_case are all restored. (R6)

## UX notes
CMP-Controls: COPY-label.sort control with COPY-sort.default / COPY-sort.recent / COPY-sort.alpha.
CMP-ResultRow carries the pin control (COPY-action.pin / COPY-action.unpin) and the
COPY-badge.last_used badge.

## Edge cases
- First run: sort = default, nothing pinned, no last-used badge (nothing copied yet).
- Recent sort with nothing copied yet behaves like default order.
- A pinned case is unaffected by the input being empty; it still holds its position.

## Open questions
