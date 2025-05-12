import {applyResize} from './helper'
import ToolManager from '~/services/tools/toolManager'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: ToolManager, e: KeyboardEvent) {
  const {interaction, action, cursor, toolManager} = this.editor

  if (e.code === 'Space') {

    interaction.spaceKeyDown = false
    if (interaction._lastTool) {
      toolManager.set(interaction._lastTool)
    }
    cursor.set('selector')
    interaction._lastTool = toolManager.currentToolName

    e.preventDefault()
    return
  }

  if (interaction.manipulationStatus === 'resizing') {
    const {altKey, shiftKey} = e

    const r = applyResize.call(this, altKey, shiftKey)

    action.dispatch('element-modifying', {
      type: 'resize',
      data: r,
    })
  }
}

export default handleKeyUp

