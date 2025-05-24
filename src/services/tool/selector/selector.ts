import {ToolType} from '~/services/tool/toolManager'
import {getRotateAngle} from '~/services/tool/selector/helper'
import dragging from '~/services/tool/selector/dragging/dragging'
import selecting from '~/services/tool/selector/selecting/selecting'

const selector: ToolType = {
  cursor: 'default',
  init: function () {
    const {interaction, action, visible, world} = this
    const {overlayCanvasContext: ctx} = world

    // translate
    visible.getVisibleSelectedElements.forEach(ele => {
      const {id} = ele

      ele.onmouseenter = () => {
        if (this.selection.has(ele.id)) return
        ctx.save()
        ctx.lineWidth = 1 / this.world.scale * this.world.dpr
        ctx.strokeStyle = '#5491f8'
        ctx.stroke(ele.path2D)
        ctx.restore()
      }

      ele.onmouseleave = () => {
        action.dispatch('render-overlay')
      }

      ele.onmousedown = () => {
        if (!this.selection.has(id)) {
          action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([id])})
        }
        this.toolManager.subTool = dragging
        interaction._draggingElements = this.elementManager.getElementsByIdSet(this.selection.values)
      }
    })

    // handles


  },
  mouseDown: function () {
    if (!this.toolManager.subTool) {
      this.toolManager.subTool = selecting
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

    if (!this.toolManager.subTool) {
      if (interaction._hoveredResizeManipulator) {
        cursor.set('nw-resize')
        // console.log(10)
      } else if (interaction._hoveredRotateManipulator) {
        // console.log(interaction._hoveredRotateManipulator.id)
        const centerPoint = {
          x: interaction._outlineElement.cx,
          y: interaction._outlineElement.cy,
        }

        const rotation = getRotateAngle(centerPoint, interaction.mouseWorldCurrent)
        cursor.set('rotate')
        cursor.rotate(rotation)
        // console.log(10)
      } else {
        cursor.set(selector.cursor)
      }
    }
    // if (!this.subTool) return
    this.toolManager.subTool?.mouseMove.call(this)
  },
  mouseUp() {
    this.toolManager.subTool?.mouseUp.call(this)
    this.interaction._rotateData = null
    this.toolManager.subTool = null
  },
}

export default selector