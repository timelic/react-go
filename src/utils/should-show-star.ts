export function shouldShowStar(i: number, j: number): boolean {
  if (i === 9 && j === 9) return true;
  if (Math.abs(i - 9) === 6 && Math.abs(j - 9) === 6) return true;
  return false;
}
