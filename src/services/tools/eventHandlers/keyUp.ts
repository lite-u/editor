import {applyResize} from './funcs'
import ToolManager from '~/services/tools/toolManager'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: ToolManager, e: KeyboardEvent) {
  if (e.code === 'Space') {
    this.spaceKeyDown = false
    // this.editor.cursor.set('default')
    // this.viewport.wrapper.style.cursor = 'default'
  }

  if (this.manipulationStatus === 'resizing') {
    const {altKey, shiftKey} = e

    const r = applyResize.call(this, altKey, shiftKey)

    this.action.dispatch('element-modifying', {
      type: 'resize',
      data: r,
    })
  }
}

export default handleKeyUp

