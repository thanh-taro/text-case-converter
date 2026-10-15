// MOD-App — the single screen (SCR-Converter). Reading order: input → notice → grid → status,
// plus one persistent polite live region for copy/notice announcements (NFR-04).
import type { JSX } from 'preact';
import { announcement } from './state';
import { InputArea } from './components/InputArea';
import { Controls } from './components/Controls';
import { Notices } from './components/Notices';
import { ResultGrid } from './components/ResultGrid';
import { StatusBar } from './components/StatusBar';

export function Converter(): JSX.Element {
  return (
    <div class="tool">
      <div class="wrap">
        <InputArea />
        <Controls />
        <Notices />
        <ResultGrid />
      </div>
      <StatusBar />
      <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement.value}
      </div>
    </div>
  );
}
