// import Editor from '../../../main/editor'
import ToolManager from '~/services/tool/toolManager'

export default function handlePointerMove(this: ToolManager, e: PointerEvent) {
  const {action, rect, cursor, interaction, world, visible} = this.editor
  const {baseCanvasContext: ctx, dpr} = world
  const x = e.clientX - rect!.x
  const y = e.clientY - rect!.y
  const {button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY} = e
  // const modifiers = {button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY}
  const point = {
    x: interaction.mouseCurrent.x * dpr,
    y: interaction.mouseCurrent.y * dpr,
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

  for (let i = arr.length - 1; i >= 0; i--) {
    const ele = arr[i]
    const path = ele.path2D

    if (!ele.show || ele.opacity <= 0) continue
    const points = ele.getPoints()
    const border = ctx.isPointInStroke(path, point.x, point.y)
    const inside = ctx.isPointInPath(path, point.x, point.y)
    console.log(border, inside)

  }
  this.tool.mouseMove.call(this)
}
