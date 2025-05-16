import ToolManager, {ToolType} from '~/services/tool/toolManager'

const selector: ToolType = {
  cursor: 'default',
  mouseDown(this: ToolManager) {
    const {shiftKey, metaKey, ctrlKey} = this.editor.interaction._modifier
    const {interaction, action, selection, cursor} = this.editor
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