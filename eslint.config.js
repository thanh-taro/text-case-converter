// ESLint flat config (ADR-0003): TypeScript, accessibility, the network/storage API ban
// (INV-01, NFR-01) and module boundaries (architecture.md "Dependency rule").
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

const NETWORK_AND_STORAGE = [
  ['fetch', 'INV-01: no network requests from the tool'],
  ['XMLHttpRequest', 'INV-01: no network requests from the tool'],
  ['WebSocket', 'INV-01: no network requests from the tool'],
  ['EventSource', 'INV-01: no network requests from the tool'],
  ['localStorage', 'PRN-01: nothing is persisted'],
  ['sessionStorage', 'PRN-01: nothing is persisted'],
  ['indexedDB', 'PRN-01: nothing is persisted'],
  ['caches', 'PRN-01: nothing is persisted (Cache Storage belongs to /sw.js only, ADR-0010)'],
  ['BroadcastChannel', 'PRN-01: nothing leaves this page'],
].map(([name, message]) => ({ name, message }));

const OTHER_WINDOWS = ['parent', 'top', 'opener'];
const OTHER_WINDOW_GLOBALS = OTHER_WINDOWS.map((name) => ({
  name,
  message: 'Only MOD-Host may reach other windows (ADR-0008).',
}));
const OTHER_WINDOW_PROPERTIES = ['window', 'self', 'globalThis'].flatMap((object) =>
  OTHER_WINDOWS.map((property) => ({ object, property, message: 'Only MOD-Host may reach other windows (ADR-0008).' })),
);

const NETWORK_PROPERTIES = [
  { object: 'navigator', property: 'sendBeacon', message: 'INV-01: no network requests from the tool' },
  { object: 'window', property: 'fetch', message: 'INV-01: no network requests from the tool' },
  { object: 'self', property: 'fetch', message: 'INV-01: no network requests from the tool' },
  { object: 'globalThis', property: 'fetch', message: 'INV-01: no network requests from the tool' },
  { object: 'document', property: 'cookie', message: 'PRN-01: nothing is persisted' },
  { object: 'window', property: 'localStorage', message: 'PRN-01: nothing is persisted' },
  { object: 'self', property: 'importScripts', message: 'INV-01: no remote scripts' },
  { object: 'navigator', property: 'storage', message: 'PRN-01: nothing is persisted' },
];

const NAVIGATION_SYNTAX = [
  "AssignmentExpression[left.type='Identifier'][left.name='location']",
  "AssignmentExpression[left.property.name='location']",
  "AssignmentExpression[left.object.name='location']",
  "CallExpression[callee.object.property.name='location'][callee.property.name=/^(assign|replace)$/]",
].map((selector) => ({ selector, message: 'INV-01: no navigation that could carry content.' }));
const OTHER_WINDOW_POST = [
  "CallExpression[callee.property.name='postMessage'][callee.object.name=/^(parent|top|opener)$/]",
  "CallExpression[callee.property.name='postMessage'][callee.object.property.name=/^(parent|top|opener)$/]",
].map((selector) => ({ selector, message: 'Only MOD-Host may post to another window (ADR-0008).' }));

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'node_modules/',
      'test-results/',
      'playwright-report/',
      '.lighthouseci/',
      '.claude/',
      '.build-my-app/',
      'design/',
      '**/*.gen.ts',
      'src/app/styles/tokens.gen.css',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    files: ['src/**/*.{ts,tsx,js}'],
    rules: {
      'no-restricted-globals': ['error', ...NETWORK_AND_STORAGE, ...OTHER_WINDOW_GLOBALS],
      'no-restricted-properties': ['error', ...NETWORK_PROPERTIES, ...OTHER_WINDOW_PROPERTIES],
      'no-restricted-syntax': ['error', ...NAVIGATION_SYNTAX, ...OTHER_WINDOW_POST],
    },
  },
  {
    // MOD-Host owns the parent-window channel; every other ban still applies.
    files: ['src/host/**'],
    rules: {
      'no-restricted-globals': ['error', ...NETWORK_AND_STORAGE],
      'no-restricted-properties': ['error', ...NETWORK_PROPERTIES],
      'no-restricted-syntax': ['error', ...NAVIGATION_SYNTAX],
    },
  },
  {
    // The offline service worker (ADR-0010) is the one place that may use Cache Storage and
    // forward the browser's own requests; it never runs in the page.
    files: ['src/host/sw.ts', 'src/host/sw-kill.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        ...NETWORK_AND_STORAGE.filter(({ name }) => name !== 'fetch' && name !== 'caches'),
      ],
    },
  },
  {
    // MOD-Engine imports nothing outside itself (architecture.md "Dependency rule").
    files: ['src/engine/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ regex: '^(?!\\./[^/]+$)', message: 'MOD-Engine imports nothing (architecture.md).' }] },
      ],
    },
  },
  {
    files: ['src/host/boot.js'],
    languageOptions: { sourceType: 'script' },
    rules: { 'no-empty': 'off', 'no-var': 'off', '@typescript-eslint/no-unused-vars': 'off' },
  },
);
