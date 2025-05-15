import {BoundingRect, Point} from '~/type'
import {ResizeDirectionName} from '~/services/selection/type'

export const getBoundingRectFromBoundingRects = (list: BoundingRect[]): BoundingRect => {
  if (list.length === 0) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      cx: 0,
      cy: 0,
    }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  list.forEach((rect: BoundingRect) => {
    minX = Math.min(minX, rect.x)
    minY = Math.min(minY, rect.y)
    maxX = Math.max(maxX, rect.x + rect.width)
    maxY = Math.max(maxY, rect.y + rect.height)
  })

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    top: minY,
    bottom: maxY,
    left: minX,
    right: maxX,
    cx: minX + (maxX - minX) / 2,
    cy: minY + (maxY - minY) / 2,
  }
}

export const getAnchorByResizeDirection = (r: BoundingRect, d: ResizeDirectionName): Point => {
  switch (d) {
    case 'tl':
      return {x: r.left, y: r.top}
    case 't':
      return {x: r.cx, y: r.top}
    case 'tr':
      return {x: r.right, y: r.top}
    case 'r':
      return {x: r.right, y: r.cy}
    case 'br':
      return {x: r.right, y: r.bottom}
    case 'b':
      return {x: r.cx, y: r.bottom}
    case 'bl':
      return {x: r.left, y: r.bottom}
    case 'l':
      return {x: r.left, y: r.cy}
    default:
      return {x: r.cx, y: r.cy}
  }
}
