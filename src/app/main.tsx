// MOD-App entry: mounts SCR-Converter and starts MOD-Host.
import { render } from 'preact';
import './styles/index.css';
import { startHost } from '../host';
import { startOffline } from '../host/offline';
import { Converter } from './Converter';

// Implements: F-011.R7 / AC12, NFR-01 — the Vietnamese UI face is requested now, in every
// language, so it is part of the initial load (and the offline seed), never fetched later.
try {
  void document.fonts?.load('400 1em Manrope', '\u1ec5').catch(() => undefined);
} catch {
  // Font loading API unavailable: the system fallback face is used.
}

const root = document.getElementById('app');
if (root) render(<Converter />, root);
// Implements: F-005.R1, F-005.R5 — after the first render, so the ready signal follows it.
startHost();
// Implements: F-007.R1 — offline support registers after the first render (ADR-0010).
startOffline();
