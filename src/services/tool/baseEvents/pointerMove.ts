import ToolManager from '~/services/tool/toolManager'
import snapTool from '~/services/tool/snap/snap'

export default function handlePointerMove(this: ToolManager, e: PointerEvent) {
  const {action, rect, cursor, interaction, world} = this.editor
  const x = e.clientX - rect!.x
  const y = e.clientY - rect!.y
  const {button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY} = e
  const noSnap = this.currentToolName === 'zoomIn' || this.currentToolName === 'zoomOut' || this.currentToolName === 'panning'

  interaction.mouseCurrent = {x, y}
  interaction.mouseDelta.x = x - interaction.mouseStart.x
  interaction.mouseDelta.y = y - interaction.mouseStart.y
  interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y)
  interaction.mouseWorldDelta = world.getWorldPointByViewportPoint(x, y)
  interaction._modifier = {button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY}

  cursor.move({x: e.clientX, y: e.clientY})
  action.dispatch('world-mouse-move')

  if (noSnap) {
    interaction._snappedPoint = null
    interaction._hoveredElement = null
  } else {
    snapTool.call(this)
  }

  action.dispatch('render-overlay')

  this.tool.mouseMove.call(this)
}
