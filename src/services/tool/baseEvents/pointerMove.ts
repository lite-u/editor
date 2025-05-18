// import Editor from '../../../main/editor'
import ToolManager from '~/services/tool/toolManager'
import snapTool from '~/services/tool/snap/snap'

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
  let doSnap = true

  interaction.mouseCurrent = {x, y}
  interaction.mouseDelta.x = x - interaction.mouseStart.x
  interaction.mouseDelta.y = y - interaction.mouseStart.y
  interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y)
  interaction.mouseWorldDelta = world.getWorldPointByViewportPoint(x, y)

  cursor.move({x: e.clientX, y: e.clientY})
  action.dispatch('world-mouse-move')
  this.editor.interaction._modifier = {button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY}

  if (this.currentToolName === 'zoomIn' || this.currentToolName === 'zoomOut' || this.currentToolName === 'panning') {
    doSnap = false
    interaction._snappedPoint = null
    interaction._hoveredElement = null
  } else {
    snapTool.call(this)
  }

  action.dispatch('render-overlay')

  this.tool.mouseMove.call(this)
}
