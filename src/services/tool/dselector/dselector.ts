import ToolManager, {ToolType} from '~/services/tool/toolManager'

const dSelector: ToolType = {
  cursor: 'default',
  mouseDown(this: ToolManager) {
    // this.editor.cursor.set('grabbing')
    // updateCursor.call(this, 'grabbing')
  },
  mouseMove(this: ToolManager) {
    // this.editor.container.setPointerCapture(e.pointerId)
  /*  const {_modifier, _pointDown} = this.editor.interaction
    const {movementX, movementY} = _modifier

    if (!_pointDown) return
    this.editor.action.dispatch('world-shift',
      {
        x: movementX,
        y: movementY,
      })*/
  },
  mouseUp(this: ToolManager) {
    // this.editor.cursor.set('grab')
  },
}

export default dSelector