import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import {ElementInstance} from '~/elements/type'
import {getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'

const rotating: SubToolType = {
  // cursor: 'default',
  mouseMove(this: ToolManager) {
    console.log(222)
    const {interaction, elementManager, action, selection, cursor} = this.editor
    const elements = elementManager.getElementsByIdSet(selection.values)
    const {_resizingData} = interaction
   /* const rects = elements.map((ele: ElementInstance) => {
      return ele.getBoundingRect()
    })*/
    // const rect = getBoundingRectFromBoundingRects(rects)
    // const center = {x: rect.cx, y: rect.cy}

    elements.forEach(ele => {
      ele.rotateFrom(10, center)
    })

    // resizeFunc.call(this, elementManager.getElementsByIdSet(selection.values), interaction.startRotation)

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