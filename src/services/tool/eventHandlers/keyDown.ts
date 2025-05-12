import {applyResize} from './helper'
import ToolManager from '~/services/tool/toolManager'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyDown(this: ToolManager, e: KeyboardEvent) {
  const _t = e.target !== this.editor.container
  if (_t) return
  const {interaction, action, cursor, toolManager} = this.editor
  const {manipulationStatus} = interaction
  if (manipulationStatus === 'panning' || manipulationStatus === 'selecting') return

  if (e.code === 'Space') {
    interaction.spaceKeyDown = true
    cursor.set('grab')
    toolManager.set('panning')
    interaction._lastTool = toolManager.currentToolName

    e.preventDefault()
    return
  }

  if (manipulationStatus === 'resizing') {
    const {altKey, shiftKey} = e

    const r = applyResize.call(this, altKey, shiftKey)

    action.dispatch('element-modifying', {
      type: 'resize',
      data: r,
    })
  }

}

export default handleKeyDown

