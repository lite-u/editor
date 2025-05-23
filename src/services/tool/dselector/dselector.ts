import ToolManager, {ToolType} from '~/services/tool/toolManager'

const dSelector: ToolType = {
  cursor: 'default',
  mouseDown(this: ToolManager) {
    this.editor.interaction._movingHandle = this.editor.interaction._hoveredHandle
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._movingHandle) return
    const {interaction, elementManager, selection} = this.editor

    // this.editor.container.setPointerCapture(e.pointerId)
    const {x, y} = interaction.mouseWorldMovement

    this.editor.interaction._movingHandle.translate(x, y)

    /*    if (!_pointDown) return
      this.editor.action.dispatch('world-shift',
        {
          x: movementX,
          y: movementY,
        })*/
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._movingHandle = null
    // this.editor.cursor.set('grab')
  },
}

export default dSelector