# Copy

Tone: short, plain, specific; say what happened and what to do. Placeholders in `{braces}`.

## Case labels (result rows)

| ID                     | Text          | Notes |
| ---------------------- | ------------- | ----- |
| **COPY-case.camel**    | camelCase     |       |
| **COPY-case.pascal**   | PascalCase    |       |
| **COPY-case.snake**    | snake_case    |       |
| **COPY-case.kebab**    | kebab-case    |       |
| **COPY-case.constant** | CONSTANT_CASE |       |
| **COPY-case.dot**      | dot.case      |       |
| **COPY-case.path**     | path/case     |       |
| **COPY-case.title**    | Title Case    |       |
| **COPY-case.sentence** | Sentence case |       |
| **COPY-case.upper**    | UPPERCASE     |       |
| **COPY-case.lower**    | lowercase     |       |

## Actions & labels

| ID                       | Text                                  | Notes                                                 |
| ------------------------ | ------------------------------------- | ----------------------------------------------------- |
| **COPY-action.copy_row** | Copy {case}                           | Accessible name / label of a result row's copy action |
| **COPY-action.clear**    | Clear                                 | Empty the input                                       |
| **COPY-action.dismiss**  | Dismiss                               |                                                       |
| **COPY-label.input**     | Text to convert                       | Accessible name of the input area                     |
| **COPY-label.results**   | Converted cases                       | Accessible name of the result grid                    |
| **COPY-label.privacy**   | Private — nothing leaves your browser | Status-bar privacy statement                          |
| **COPY-label.no_result** | No result                             | Accessible name of an empty result row's value        |
| **COPY-link.source**     | Source code                           | Status-bar link to the public source (F-006.R4)       |
| **COPY-link.source_a11y** | Source code (opens in a new tab)     | Accessible name of the source link                    |

## Placeholders & status

| ID                           | Text                                                                       | Notes                                                   |
| ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------- |
| **COPY-placeholder.input**   | Type or paste text to convert — a name, a phrase, or a list (one per line) | Input empty state                                       |
| **COPY-result.empty**        | —                                                                          | Shown in a result row when the input is empty           |
| **COPY-status.copied**       | Copied {case}                                                              | Spoken announcement after a copy (aria-live)            |
| **COPY-status.copied_short** | Copied                                                                     | Visible flash label on the copied row                   |
| **COPY-status.copy_failed**  | Couldn't copy — select the text and copy manually                          | Shown and announced when the clipboard write is refused |
| **COPY-status.lines**        | {n} lines                                                                  | Shown when the input has more than one line             |
| **COPY-notice.large**        | Large input — results update after you stop typing                         | Shown once past the RULE-08 cap                         |

## Options & sorting (M-2)

| ID                       | Text            | Notes                                              |
| ------------------------ | --------------- | -------------------------------------------------- |
| **COPY-label.options**   | Options         | Accessible name of the controls group              |
| **COPY-action.strip**    | Strip symbols   | Toggle (RULE-11)                                   |
| **COPY-action.accents**  | Remove accents  | Toggle (RULE-12)                                   |
| **COPY-label.sort**      | Sort            | Label of the sort control (RULE-13)                |
| **COPY-sort.default**    | Default order   | Sort option                                        |
| **COPY-sort.recent**     | Recently copied | Sort option                                        |
| **COPY-sort.alpha**      | A–Z             | Sort option (alphabetical by case label)           |
| **COPY-action.pin**      | Pin {case}      | Pin a case to the top (accessible name)            |
| **COPY-action.unpin**    | Unpin {case}    | Unpin a case (accessible name)                     |
| **COPY-badge.last_used** | Last used       | Badge on the most-recently-copied row (RULE-13)    |
