// MOD-Engine — public surface. Pure, zero-dependency tokenizer + case renderers.
// Implements: RULE-01, RULE-01b, RULE-02, RULE-03, RULE-04, RULE-05, RULE-06, RULE-16, RULE-17;
// INV-02, INV-03, INV-04.
export { tokenize } from './tokenize';
export { convert, convertAll, matchingCases, CASE_IDS, TOKEN_BASED, type CaseId, type ConvertOptions } from './render';
export { removeAccents, toAsciiToken } from './transform';
