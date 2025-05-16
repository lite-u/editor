// import Editor from '../../../main/editor'
import ToolManager from '~/services/tool/toolManager'
import {Point} from '~/type'
import {isPointNear} from '~/core/geometry'
import {isPointNearStroke} from '~/services/tool/helper'

export default function handlePointerMove(this: ToolManager, e: PointerEvent) {
  const {action, rect, cursor, interaction, world, visible} = this.editor
  const {baseCanvasContext: ctx, dpr} = world
  const x = e.clientX - rect!.x
  const y = e.clientY - rect!.y
  const {button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY} = e
  const viewPoint = {
    x: x * dpr,
    y: y * dpr,
  }

  interaction.mouseCurrent = {x, y}
  interaction.mouseDelta.x = x - interaction.mouseStart.x
  interaction.mouseDelta.y = y - interaction.mouseStart.y
  interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y)
  interaction.mouseWorldDelta = world.getWorldPointByViewportPoint(x, y)

  cursor.move({x: e.clientX, y: e.clientY})
  action.dispatch('world-mouse-move')
  this.editor.interaction._modifier = {button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY}

  const arr = visible.values
  interaction._hoveredElement = null
  interaction._pointHit = null

  for (let i = arr.length - 1; i >= 0; i--) {
    const ele = arr[i]
    const path = ele.path2D

    if (!ele.show || ele.opacity <= 0) continue

    const points: Point[] = ele.getPoints
    const border = ctx.isPointInStroke(path, viewPoint.x, viewPoint.y)
    // const border = isPointNearStroke(ctx, path, viewPoint, 10)
    const inside = ctx.isPointInPath(path, viewPoint.x, viewPoint.y)
    const point = points.find(p => isPointNear(p, viewPoint))

    if (point) {
      interaction._hoveredElement = ele
      interaction._pointHit = {
        type: 'anchor',
        ...point,
      }
      break
    } else if (border) {
      console.log(border)
      interaction._hoveredElement = ele
      interaction._pointHit = {
        type: 'path',
        ...interaction.mouseWorldCurrent,
      }
      break
    } else if (inside) {
      if (ele.fill.enabled) {
        interaction._hoveredElement = ele
        // interaction._pointHit = null
      } else {

      }
    } else {
      // interaction._hoveredElement = null
      // interaction._pointHit = null
    }
  }

  // snap
  if (interaction._pointDown) {

  }
  action.dispatch('render-selection')

  this.tool.mouseMove.call(this)
}
