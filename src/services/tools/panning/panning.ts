import Editor from '~/main/editor'
import {updateCursor} from '~/services/viewport/domManipulations'
import {ToolManager} from '~/services/tools/toolManager'

const panning: ToolManager = {
  start(this: Editor) {
    this.cursor.set('grabbing')
    updateCursor.call(this, 'grabbing')
  },
  move(this: Editor, e: PointerEvent) {
    this.viewport.wrapper.setPointerCapture(e.pointerId)
    this.action.dispatch('world-shift',
      {
        x: e.movementX,
        y: e.movementY,
      })
  },
  finish(this: Editor) {
    this.cursor.set('grab')
  },
}

export default panning