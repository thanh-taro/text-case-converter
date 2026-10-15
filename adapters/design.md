# Design adapter — Code-first HTML mockup

Tool: a static HTML mockup under `design/` that renders the screen states from the specs. The
mockup is a derived artifact: the specs (`specs/30-experience/`) stay the source of truth. This
matches the tool's code-first build (design ≈ implementation) and the JSON Formatter sibling's
token system.

## Files

- `design/mockup.html` — all SCR-Converter states and CMP variants, both themes, at embedded and
  narrow viewports, on one scrollable page. Opens with no build step and no network.
- Tokens are inlined into the mockup as CSS custom properties generated from
  `specs/30-experience/tokens.json`; the values must equal tokens.json exactly.

## Naming

- Each state block is titled `<SCR-ID> / <state> / <theme> / <viewport>`, e.g.
  `SCR-Converter / default / dark / embedded`.
- Component variants are titled `<CMP-ID> / <variant> / <theme>`, covering every row of each
  component's "Variants & states" table.
- Viewports: **embedded** ~1200 wide (the portal's desktop tool area) and **narrow** 360–390 wide
  (the portal's phone layout; NFR-06 minimum is 320).

## Tokens

- Declared as `--tk-color-<role>`, `--tk-space-<n>`, `--tk-radius-<name>`, `--tk-font-<role>`,
  `--tk-size-<name>`; dark on `:root`, light under `[data-theme="light"]` (same scheme the build
  will generate via codegen, and the same as the portal).
- Every spacing, radius, type, size and color value must come from a token. A hard-coded value
  with no token is a finding.

## Copy

- Every visible string comes from `specs/30-experience/copy.md`; each text element carries
  `data-copy="<COPY-ID>"`. The sample text the user "typed" (e.g. `getUserID`) and the sample
  converted values are the only strings without a COPY ID, and are labeled as sample data.

## Review

Each state block names its spec ID. The design-auditor checks coverage (state × theme × viewport),
COPY IDs and tokens; the ui-critic reviews screenshots; the a11y-auditor checks contrast, target
sizes and reading order.
