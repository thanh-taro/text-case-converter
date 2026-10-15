# Principles

- **PRN-01** — _Private by construction._ User text never leaves the device: no uploads, no
  analytics, no share links, no content stored between sessions. When in doubt, don't send.
- **PRN-02** — _Every case at once._ The user never picks a target case first. All cases are
  shown live for the current input, so the answer is always on screen.
- **PRN-03** — _Tokenize right._ Splitting input into words is the heart of the tool. Acronyms,
  numbers and existing delimiters are handled the way a developer would expect, and the chosen
  rules are documented rather than hidden.
- **PRN-04** — _Lists, not just lines._ Multi-line input is converted line by line, so a pasted
  list of names comes back as a converted list.
- **PRN-05** — _Fits the host._ Looks and behaves like part of the portal when embedded, and
  remains fully usable on its own.
- **PRN-06** — _Never block._ The interface stays responsive as the user types or pastes, at any
  reasonable input size.
