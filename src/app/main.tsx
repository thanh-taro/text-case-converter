// MOD-App entry: mounts SCR-Converter and starts MOD-Host.
import { render } from 'preact';
import './styles/index.css';
import { startHost } from '../host';
import { startOffline } from '../host/offline';
import { Converter } from './Converter';

// Implements: F-011.R7 / AC12, NFR-01 — the Vietnamese UI face is requested during the initial
// load, in every language (and so is in the offline seed), never fetched later. Each Manrope face
// (Latin, Vietnamese) is loaded directly: WebKit may not have registered the stylesheet's faces
// yet when this script runs, so it is retried on the next frame and at page load.
function loadUiFaces(): void {
  try {
    document.fonts?.forEach((face) => {
      if (face.family.replace(/["']/g, '') === 'Manrope' && face.status === 'unloaded') {
        void face.load().catch(() => undefined);
      }
    });
  } catch {
    // Font loading API unavailable: the system fallback face is used.
  }
}
loadUiFaces();
requestAnimationFrame(loadUiFaces);
addEventListener('load', loadUiFaces, { once: true });

const root = document.getElementById('app');
if (root) render(<Converter />, root);
// Implements: F-005.R1, F-005.R5 — after the first render, so the ready signal follows it.
startHost();
// Implements: F-007.R1 — offline support registers after the first render (ADR-0010).
startOffline();
