export const getReturnType_CPP = (code: string): string | null => {
  // Find the line containing the function signature
  const lines = code.split("\n");
  // For simplicity, assume the first non-empty line is the signature
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // This regex matches: <return_type> <function_name>(...
    const match = trimmed.match(/^(\w[\w\s:*&<>]*?)\s+\w+\s*\(.*\)/);
    if (match) {
      // Return the captured return type (trimmed)
      return match[1].trim();
    }
  }
  return null;
};
