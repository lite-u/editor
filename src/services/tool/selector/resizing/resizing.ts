import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import resizeFunc from '~/services/tool/resize/resizeFunc'

const resizing: SubToolType = {
  // cursor: 'default',
  mouseMove(this: ToolManager) {
    // console.log(111)
    // interaction._resizingElements = elementManager.getElementsByIdSet(selection.values)
    const {interaction, elementManager, action, selection, cursor} = this.editor

    resizeFunc.call(this, elementManager.getElementsByIdSet(selection.values), interaction._resizingData.placement)

    this.editor.action.dispatch('element-updated')

    /*
        interaction._outlineElement?.rotateFrom(rotationDiff, targetPoint)
        interaction._manipulationElements.forEach(ele => {
          ele.rotateFrom(rotationDiff, targetPoint)
        })
        elements.forEach(ele => {
          ele.rotateFrom(rotationDiff, targetPoint)
        })

        this.editor.action.dispatch('render-overlay')
        this.editor.action.dispatch('render-elements')*/
    // this.subTool.mouseMove.call(this)
  },
  mouseUp(this: ToolManager) {
    if (!this.subTool) return

    // this.subTool.mouseUp.call(this)
    this.subTool = null
  },
}

export default resizing