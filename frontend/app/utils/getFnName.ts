export const getFnName_PY = (code: string): string | null => {
  const lines = code.split("\n").reverse();
  for (const line of lines) {
    const match = line.trim().match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    if (match) {
      return match[1];
    }
  }
  return null;
};
export const getFnName_JS = (code: string): string | null => {
  const lines = code.split("\n").reverse();
  for (const line of lines) {
    const trimmed = line.trim();

    // Match: function fnName(...) { ... }
    let match = trimmed.match(/^function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    if (match) return match[1];

    // Match: const fnName = function(...) { ... }
    match = trimmed.match(
      /^const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*function\s*\(/
    );
    if (match) return match[1];

    // Match: const fnName = (...) => { ... }
    match = trimmed.match(
      /^const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\(?.*\)?\s*=>\s*{/
    );
    if (match) return match[1];
  }
  return null;
};
