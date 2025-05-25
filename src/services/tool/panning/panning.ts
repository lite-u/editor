import ToolManager, {ToolType} from '~/services/tool/toolManager'

const panning: ToolType = {
  cursor: 'grab',
  mouseDown() {
    this.cursor.set('grabbing')
    // updateCursor.call(this, 'grabbing')
  },
  mouseMove() {
    // this.container.setPointerCapture(e.pointerId)
    const {_modifier, _pointDown} = this.interaction
    const {movementX, movementY} = _modifier

    if (!_pointDown) return
    this.action.dispatch('world-shift',
      {
        x: movementX,
        y: movementY,
      })
  },
  mouseUp() {
    this.cursor.set('grab')
  },
}

export default panning