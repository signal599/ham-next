export function formatGridSquare(code: string): string {
  return `${code.substring(0, 2).toUpperCase()}${code.substring(2, 4)}${code.substring(4).toLowerCase()}`;
}
