import { ShapeType, toPoints } from 'svg-points';

export function svg() {
  const data: ShapeType = {
    type: "path",
    d: "M13682 7794 c-40 -17 -41 -38 -1 -54 27 -11 30 -17 25 -41 -5 -24 -2 -30 19 -35 14 -3 32 -4 40 0 22 8 18 43 -5 56 -18 10 -19 13 -5 34 12 19 13 25 3 33 -25 19 -44 21 -76 7z"
  }

  return toPoints(data)
}