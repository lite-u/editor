import ToolManager, {ToolType} from '~/services/tool/toolManager'

const panning: ToolType = {
  cursor: 'grab',
  mouseDown(this: ToolManager) {
    this.editor.cursor.set('grabbing')
    // updateCursor.call(this, 'grabbing')
  },
  mouseMove(this: ToolManager) {
    // this.editor.container.setPointerCapture(e.pointerId)
    const {_modifier, mouseStart, mouseCurrent} = this.editor.interaction

    this.editor.action.dispatch('world-shift',
      {
        x: mouseCurrent.x - mouseStart.x,
        y: mouseCurrent.y - mouseStart.y,
      })
  },
  mouseUp(this: ToolManager) {
    this.editor.cursor.set('grab')
  },
}

export default panning