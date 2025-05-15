import ToolManager from '~/services/tool/toolManager'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: ToolManager, e: KeyboardEvent) {
  const {interaction, toolManager, action} = this.editor
  const {shiftKey, metaKey, ctrlKey, altKey} = e

  if (e.code === 'Space') {
    if (interaction._lastTool) {
      toolManager.set(interaction._lastTool)
      action.dispatch('switch-tool', interaction._lastTool)
    }
    e.preventDefault()
  } else {
    interaction._modifier = {...interaction._modifier, shiftKey, metaKey, ctrlKey, altKey}
    this.tool.mouseMove.call(this)

  }

  interaction._lastTool = null
}

export default handleKeyUp

