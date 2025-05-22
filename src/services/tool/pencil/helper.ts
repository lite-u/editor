import {Point} from '~/type'
import {BezierPoint} from '~/elements/props'
import ElementPath from '~/elements/path/path'

export function convertPointsToBezierPoints(points: Point[], tension = 0.3): { center: Point, points: BezierPoint[], closed: boolean } {
  const filtered: Point[] = []
  const offsetThreshold = 2
  const closeThreshold = 20

  // filter minor movements
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      filtered.push(points[i])
    } else {
      const prev = filtered[filtered.length - 1]
      const dx = points[i].x - prev.x
      const dy = points[i].y - prev.y
      if (Math.hypot(dx, dy) >= offsetThreshold) {
        filtered.push(points[i])
      }
    }
  }

  points = filtered
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

  const rect = ElementPath._getBoundingRect(bezierPoints)
  const center = {x: rect.cx, y: rect.cy}

  for (const point of bezierPoints) {
    point.anchor.x -= center.x
    point.anchor.y -= center.y
    if (point.cp1) {
      point.cp1.x -= center.x
      point.cp1.y -= center.y
    }
    if (point.cp2) {
      point.cp2.x -= center.x
      point.cp2.y -= center.y
    }
  }

  // console.log(rect)

  const isClosed = bezierPoints.length > 2 &&
    Math.hypot(bezierPoints[0].anchor.x - bezierPoints[bezierPoints.length - 1].anchor.x, bezierPoints[0].anchor.y - bezierPoints[bezierPoints.length - 1].anchor.y) < closeThreshold;

  return {
    center,
    points: bezierPoints,
    closed: isClosed,
  }
}

export function drawLine(ctx: CanvasRenderingContext2D, p1: Point, p2: Point,lineWidth=1) {
  ctx.save()
  ctx.strokeStyle = '#000'
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
  ctx.restore()
}