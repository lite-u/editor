import ToolManager from '~/services/tool/toolManager'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: ToolManager, e: KeyboardEvent) {
  const {interaction, toolManager} = this.editor
  const {shiftKey, metaKey, ctrlKey, altKey} = e

  console.log(e.code)
  if (e.code === 'Space') {

    console.log(interaction._lastTool)
    // interaction.spaceKeyDown = false
    if (interaction._lastTool) {
      toolManager.set(interaction._lastTool)
    }
    // cursor.set('selector')
    interaction._lastTool = toolManager.currentToolName

    e.preventDefault()
  } else {
    interaction._modifier = {...interaction._modifier, shiftKey, metaKey, ctrlKey, altKey}
    this.tool.mouseMove.call(this)

  }

  interaction._lastTool = null
}

export default handleKeyUp

