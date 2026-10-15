// MOD-IO — clipboard write (ADR-0007). The only side effect the tool has on the device, and only
// on an explicit user action (RULE-07, PRN-01, INV-01).
// Implements: F-003.R1, F-003.R3, F-003.R5.

/** Write text to the clipboard. Returns true on success, false if the browser refuses it. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
