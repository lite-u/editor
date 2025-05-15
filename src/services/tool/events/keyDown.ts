// import {applyResize} from './helper'
import ToolManager from '~/services/tool/toolManager'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyDown(this: ToolManager, e: KeyboardEvent) {
  const {target, shiftKey, metaKey, ctrlKey, altKey} = e

  if (target !== this.editor.container) return

  const {interaction, action, toolManager} = this.editor
  const {state} = interaction
  if (state === 'panning' || state === 'selecting') return

  if (e.code === 'Space') {
    action.dispatch('switch-tool', 'panning')
    interaction._lastTool = toolManager.currentToolName

    e.preventDefault()
  } else {
    interaction._modifier = {...interaction._modifier, shiftKey, metaKey, ctrlKey, altKey}
    this.tool.mouseMove.call(this)
  }

  if (state === 'resizing') {
    /*const {altKey, shiftKey} = e

    const r = applyResize.call(this, altKey, shiftKey)

    action.dispatch('element-modifying', {
      type: 'resize',
      data: r,
    })*/
  }

}

export default handleKeyDown

