import {ToolType} from '~/services/tool/toolManager'
import {getRotateAngle} from '~/services/tool/selector/helper'
import rotating from '~/services/tool/selector/rotating/rotating'

const selector: ToolType = {
  cursor: 'default',
  init: function () { },
  mouseDown: function () {
    console.log(9)
    if (!this.toolManager.subTool) {
      // this.toolManager.subTool = selecting
    }
    /* const {interaction, elementManager, selection, cursor} = this
     // const {_hoveredElement} = interaction

     const rotateMode = !!interaction._hoveredRotateManipulator
     const resizeMode = !!interaction._hoveredResizeManipulator

     if (resizeMode) {
       const placement = interaction._hoveredResizeManipulator.id.replace('handle-resize-', '')
       cursor.set('resize')
       this.subTool = resizing

       interaction._resizingData = {placement}

       cursor.set('resize')
       this.subTool = resizing
     } else if (rotateMode) {
       const rects = elementManager.getElementsByIdSet(selection.values).map(ele => {
         return ele.getBoundingRect(true)
       })
       const center = getBoundingRectFromBoundingRects(rects)
       const {cx: x, cy: y} = center

       console.log(interaction._hoveredElement)
       interaction._rotateData = {startRotation: interaction._outlineElement.rotation, targetPoint: {x, y}}
       this.subTool = rotating
     } */
  },
  mouseMove: function () {
    const {interaction, cursor} = this
    if (interaction._rotateData) {
      rotating.mouseMove.call(this)
      return
    }

    if (!this.toolManager.subTool) {
      if (interaction._hoveredResizeManipulator) {
        cursor.set('nw-resize')
        // console.log(10)
      } else if (interaction._hoveredRotateManipulator) {
        // console.log(interaction._hoveredRotateManipulator.id)
        const centerPoint = {
          x: interaction.selectedOutlineElement.cx,
          y: interaction.selectedOutlineElement.cy,
        }

        const rotation = getRotateAngle(centerPoint, interaction.mouseWorldCurrent)
        cursor.set('rotate')
        cursor.rotate(rotation)
        // console.log(10)
      } else {
        // cursor.set(selector.cursor)
      }
    }
    // if (!this.subTool) return
    this.toolManager.subTool?.mouseMove.call(this)
  },
  mouseUp() {
    if (this.interaction._rotateData) {
      rotating.mouseUp.call(this)
    } else {
      this.toolManager.subTool?.mouseUp.call(this)
    }
    this.cursor.set(selector.cursor)
    this.toolManager.subTool = null
  },
}

export default selector