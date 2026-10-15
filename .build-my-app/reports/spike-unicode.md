# Spike SPK-unicode — casing & pass-through of non-ASCII

Date: 2026-10-15 · Resolved by: ADR-0011 · Status: closed

## Question

Does JS locale-independent case mapping behave on non-ASCII input (accents, Greek, CJK, emoji,
the Turkish-i trap, combining marks), and does non-cased text pass through unchanged (RULE-05)?

## Method

Ran `String.prototype.toLowerCase`/`toUpperCase` on a short set and inspected the output under Node.

## Result

| Input        | Op    | Output                  | Note                                               |
| ------------ | ----- | ----------------------- | -------------------------------------------------- |
| `BIG`        | lower | `big`                   | locale-independent — NOT the Turkish dotless `bıg` |
| `café`       | upper | `CAFÉ`                  | accents cased, no mojibake                         |
| `ΣΊΣΥΦΟΣ`    | lower | `σίσυφος`               | Greek final sigma handled                          |
| `日本語`     | lower | `日本語`                | CJK caseless — unchanged                           |
| `🎉A`        | lower | `🎉a`                   | emoji passes through                               |
| `İ` (U+0130) | lower | `i̇` (i + combining dot) | locale-independent default                         |
| `café`       | upper | `CAFÉ`                  | combining mark preserved                           |

Tokenization (RULE-02) only inserts boundaries around cased letters and digits, so a caseless
letter never starts a new token — `日Foo` stays a single token (pinned by F-002.AC16).

## Verdict

Use the locale-independent `toLowerCase`/`toUpperCase` (never `toLocale*`); pass non-cased code
points through unchanged; no locale selection and no script-change boundary in M-1 (ADR-0011).

## Spec impact

None — RULE-05 and F-002.AC15/AC16 already encode this; the spike confirmed the platform matches.
