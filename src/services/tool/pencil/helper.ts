import {Point} from '~/type'
import {BezierPoint} from '~/elements/props'

export function convertPointsToBezierPoints(points: Point[], tension = 0.3): BezierPoint[] {
  const bezierPoints: BezierPoint[] = []

  for (let i = 0; i < points.length; i++) {
    const prev = points[i - 1] ?? points[i]
    const curr = points[i]
    const next = points[i + 1] ?? points[i]
    const next2 = points[i + 2] ?? next

    // Vector from prev to next
    const dx1 = (next.x - prev.x) * tension
    const dy1 = (next.y - prev.y) * tension

    // Vector from curr to next2
    const dx2 = (next2.x - curr.x) * tension
    const dy2 = (next2.y - curr.y) * tension

    const handleIn: Point | null = i === 0 ? null : {x: curr.x - dx1 / 2, y: curr.y - dy1 / 2}
    const handleOut: Point | null = i === points.length - 1 ? null : {x: curr.x + dx2 / 2, y: curr.y + dy2 / 2}

    bezierPoints.push({
      anchor: {...curr},
      cp1: handleIn,
      cp2: handleOut,
      type: 'smooth', // optional – set based on need
    })
  }

  return bezierPoints
}