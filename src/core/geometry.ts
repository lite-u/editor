/*
const rotatePointAroundPoint = (p1: Point, p2: Point, rotation: number) => {

}

export default rotatePointAroundPoint
*/

import {Point} from '~/type'

export function rotatePointAroundPoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  rotation: number,
) {
  const dx = px - cx
  const dy = py - cy
  const angle = rotation * (Math.PI / 180)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  }
}

export function transformPoints(points: Point[], matrix: DOMMatrix): Point[] {
  return points.map(p => matrix.transformPoint(p))
}

export function isPointNear(p1: Point, p2: Point, tolerance: number = 3): boolean {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  const distanceSquared = dx * dx + dy * dy
  return distanceSquared <= tolerance * tolerance
}