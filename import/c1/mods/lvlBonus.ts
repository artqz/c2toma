export const LEVEL_BONUS = (LVL: number) => {
  let bonus = 0
  if (LVL >= 1 && LVL <= 70) {
    bonus = 1 * LVL
  }
  if (LVL >= 71 && LVL <= 78) {
    bonus = 70 + 2 * (LVL-70)
  }
  if (LVL >= 79) {
    bonus = 86 + 3 * (LVL-78)
  }
  return bonus
}