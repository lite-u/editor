// import {updateCursor} from '~/services/viewport/domManipulations'
import ToolManager from '~/services/tool/toolManager'

const panning = {
  cursor: 'grab',
  start(this: ToolManager) {
    this.editor.cursor.set('grabbing')
    // updateCursor.call(this, 'grabbing')
  },
  move(this: ToolManager, e: PointerEvent) {
    this.editor.container.setPointerCapture(e.pointerId)

    this.editor.action.dispatch('world-shift',
      {
        x: e.movementX,
        y: e.movementY,
      })
  },
  finish(this: ToolManager) {
    this.editor.cursor.set('grab')
  },
}

export default panning