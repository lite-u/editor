import ToolManager from '~/services/tool/toolManager'
import snapTool from '~/services/tool/snap/snap'
import detectTool from '~/services/tool/detectTool'

export default function handlePointerMove(this: ToolManager, e: PointerEvent) {
  const {action, rect, cursor, interaction, world} = this.editor
  const {dpr, scale} = world
  const x = e.clientX - rect!.x
  const y = e.clientY - rect!.y
  const {button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY} = e
  const stopSnap = this.currentToolName === 'zoomIn' || this.currentToolName === 'zoomOut' || this.currentToolName === 'panning'

  interaction.mouseCurrent = {x, y}
  interaction.mouseDelta.x = x - interaction.mouseStart.x
  interaction.mouseDelta.y = y - interaction.mouseStart.y
  interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y)
  interaction.mouseWorldDelta = world.getWorldPointByViewportPoint(x, y)
  interaction.mouseWorldMovement = {x: movementX * dpr / scale, y: movementY * dpr / scale}
  interaction._modifier = {button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY}
  // console.log(movementX,movementY)
  cursor.move({x: e.clientX, y: e.clientY})

  if (stopSnap) {
    interaction._snappedPoint = null
    interaction._hoveredElement = null
  } else {
    detectTool.call(this)
    snapTool.call(this)
  }

  // console.log(interaction._snappedPoint)
  action.dispatch('world-mouse-move')
  action.dispatch('render-overlay')

  this.tool.mouseMove.call(this)
}
