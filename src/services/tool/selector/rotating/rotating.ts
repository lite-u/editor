import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import resizeFunc from '~/services/tool/resize/resizeFunc'

const rotating: SubToolType = {
  // cursor: 'default',
  mouseMove(this: ToolManager) {
    console.log(222)
    const {interaction, elementManager, action, selection, cursor} = this.editor

    resizeFunc.call(this, elementManager.getElementsByIdSet(selection.values), interaction._resizingData.placement)

    this.editor.action.dispatch('element-updated')

    // this.subTool.mouseMove.call(this)
  },
  mouseUp(this: ToolManager) {
    if (!this.subTool) return

    // this.subTool.mouseUp.call(this)
    this.subTool = null
  },
}

export default rotating