# Domain model

M-1 stores nothing between sessions (PRN-01); every entity lives only in memory.

### ENT-Input — Input

The text currently being converted.

- `text` — the full content, any length (responsiveness cap: RULE-08).
- `lines` — the content split at line breaks; conversion is per line (RULE-03).
- `isEmpty` — whether the text has zero characters (RULE-09).

### ENT-Token — Token

One word a line is split into before re-joining (RULE-02).

- `text` — the token's characters as they appear in the input (case not yet changed).
- A line produces an ordered list of tokens; token-based results are built from this list.

### ENT-CaseKind — Case kind

One of the eleven ways to render the input (RULE-01, RULE-01b).

- `id` — stable identifier, e.g. `camel`, `snake`, `kebab`, `constant`, `pascal`, `dot`,
  `path`, `title`, `sentence`, `upper`, `lower`.
- `label` — the user-facing name shown on the result row (defined as copy strings).
- `tokenBased` — whether it tokenizes (RULE-02) or folds characters directly (RULE-01b).

### ENT-Result — Result

The input rendered in one case kind.

- `kind` — the ENT-CaseKind.
- `text` — the converted text, with the same line structure as the input (RULE-03).
- `isEmpty` — whether it has no characters (true when the input is empty, RULE-09).

## Invariants

- **INV-01** No user text, or anything derived from it, is sent off the device (PRN-01).
- **INV-02** Conversion is deterministic: the same input always produces the same eleven
  results. M-1 has no settings or hidden state that could change an output.
- **INV-03** Every token-based result has the same number of lines as the input; a blank input
  line stays a blank line in the result (RULE-03).
- **INV-04** Characters with no case mapping appear unchanged in every result (RULE-05); the
  character-based kinds (RULE-01b) additionally preserve every separator and the full line
  structure in place.
- **INV-05** Each shown result always corresponds to the current input text (results are never
  shown stale without being recomputed for the latest input, subject to the RULE-08 cap).
