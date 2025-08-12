export const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(/[\s-_]+/)  // split by spaces, dashes, underscores
    .map((word, index) =>
      index === 0
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}
