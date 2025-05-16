import ToolManager, {ToolType} from '~/services/tool/toolManager'

const selector: ToolType = {
  cursor: 'default',
  mouseDown(this: ToolManager) {
    const {shiftKey, metaKey, ctrlKey} = this.editor.interaction._modifier
    const {interaction, action, selection, cursor} = this.editor

    if (interaction._hoveredElement) {
      action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([interaction._hoveredElement.id])})
    }
  },
  mouseMove(this: ToolManager,) {
    const {shiftKey, metaKey, ctrlKey} = this.editor.interaction._modifier
    const {interaction, action, selection, cursor} = this.editor

  },
  mouseUp(this: ToolManager) {
    const {shiftKey, metaKey, ctrlKey} = this.editor.interaction._modifier
    const {interaction, action, selection, cursor} = this.editor
  },
}

export default selector