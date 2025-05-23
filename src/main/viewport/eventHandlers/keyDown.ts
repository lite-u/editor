import Editor from '../../editor'
import {applyResize} from './funcs'
import {updateCursor} from '../domManipulations'

// import {updateSelectionBox} from "../domManipulations"

function handleKeyDown(this: Editor, e: KeyboardEvent) {
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

    this.action.dispatch('module-modifying', {
      type: 'resize',
      data: r,
    })
  }

}

export default handleKeyDown

