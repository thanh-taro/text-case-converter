# Glossary

| Term                        | Meaning                                                                                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Input                       | The text currently in the input area. May be empty, one line, or many lines.                                                                                                                                              |
| Line                        | A run of characters between line breaks. Multi-line input is converted line by line (RULE-03).                                                                                                                            |
| Token                       | One word the input is split into before re-joining in a case (RULE-02). E.g. `getUserID` splits into `get`, `User`, `ID`.                                                                                                 |
| Tokenization                | Splitting a line into tokens at separators and letter-case boundaries, including before a capital that follows a digit; digits stay attached to their token, so there is no split between a letter and a digit (RULE-02). |
| Separator (delimiter)       | A character that separates tokens in the input: space, `_`, `-`, `.`, `/`, and any other non-alphanumeric character. "Separator" and "delimiter" are used interchangeably; RULE-02 uses "separator" (RULE-02).            |
| Acronym                     | A run of consecutive capital letters, e.g. `HTTP`, `ID`, `URL`; handled as one token where it ends before a following capitalized word (RULE-02).                                                                         |
| Case (case kind)            | One way of joining tokens into a string: the eleven kinds in RULE-01.                                                                                                                                                     |
| Result                      | The input converted into one case kind, shown in one row of the grid.                                                                                                                                                     |
| Cased / non-cased character | A character that has an upper/lower form (most letters) versus one that does not (digits, punctuation, CJK, emoji). Non-cased characters pass through untouched (RULE-05).                                                |
| Pass-through                | Leaving characters the conversion cannot meaningfully re-case exactly as written (RULE-05).                                                                                                                               |
| Host                        | The portal page that embeds the tool.                                                                                                                                                                                     |
| Standalone                  | The tool opened at its own address, not embedded.                                                                                                                                                                         |
| Preference | A per-device setting (not user content) remembered locally: the strip-symbols and remove-accents toggles, the sort mode, pins and recent-use order (ENT-Preferences, RULE-14). |
| ASCII-fold | Reducing an accented Latin letter to its plain ASCII base, e.g. `é`→`e`, `đ`→`d` (RULE-12). |
| Sort mode | How result rows are ordered: default, recently copied, or alphabetical (RULE-13). |
| Pin | Marking a case so its row floats to the top of the grid (RULE-13). |
| Last-used badge | A text marker on the most-recently-copied case's row (RULE-13, COPY-badge.last_used). |
