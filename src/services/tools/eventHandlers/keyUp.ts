import {applyResize} from './helper'
import ToolManager from '~/services/tools/toolManager'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: ToolManager, e: KeyboardEvent) {
  if (e.code === 'Space') {
    const {interaction, action, cursor, toolManager} = this.editor

    interaction.spaceKeyDown = false
    if(interaction._lastTool){
      toolManager.set(interaction._lastTool)
    }
    cursor.set(interaction._lastTool!)
    interaction._lastTool = toolManager.currentToolName

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

export default handleKeyUp

