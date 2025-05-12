import Editor from '../../../main/editor'
import {applyResize} from './helper'
import {updateCursor} from '../../viewport/domManipulations'
import ToolManager from '~/services/tools/toolManager'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyDown(this: ToolManager, e: KeyboardEvent) {
  // const _t = e.target !== this.wrapper
  if (this.manipulationStatus === 'panning' || this.manipulationStatus === 'selecting') return

  if (e.code === 'Space') {
    this.viewport.spaceKeyDown = true
    updateCursor.call(this, 'grabbing')
    // this.viewport.wrapper.style.cursor = 'grabbing'
    e.preventDefault()
    return
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

export default handleKeyDown

