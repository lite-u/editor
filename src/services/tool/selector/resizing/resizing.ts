import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import resizeFunc from '~/services/tool/resize/resizeFunc'

const resizing: SubToolType = {
  // cursor: 'default',
  mouseMove(this: ToolManager) {
    // console.log(111)
    // interaction._resizingElements = elementManager.getElementsByIdSet(selection.values)
    const {interaction, mainHost, action, selection, cursor} = this

    resizeFunc.call(this, mainHost.getElementsByIdSet(selection.values), interaction._resizingData.placement)

    this.action.dispatch('element-updated')

/*
    interaction._outlineElement?.rotateFrom(rotationDiff, targetPoint)
    interaction._manipulationElements.forEach(ele => {
      ele.rotateFrom(rotationDiff, targetPoint)
    })
    elements.forEach(ele => {
      ele.rotateFrom(rotationDiff, targetPoint)
    })

    this.action.dispatch('render-overlay')
    this.action.dispatch('render-main-host')*/
    // this.subTool.mouseMove.call(this)
  },
  mouseUp(this: ToolManager) {
    if (!this.subTool) return

    // this.subTool.mouseUp.call(this)
    this.subTool = null
  },
}

export default resizing