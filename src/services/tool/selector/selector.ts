import {ToolType} from '~/services/tool/toolManager'
import resizing from '~/services/tool/selector/resizing/resizing'
import rotating from '~/services/tool/selector/rotating/rotating'
import {getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'
import {getRotateAngle} from '~/services/tool/selector/helper'

const selector: ToolType = {
  cursor: 'default',
  init: function () {
    const {interaction, action, visible, world} = this
    const {overlayCanvasContext: ctx} = world

    visible.getVisibleSelectedElements.forEach(ele => {
      const {id} = ele

      ele.onmouseenter = () => {
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
        interaction._draggingElements = this.elementManager.getElementsByIdSet(this.selection.values)
      }
    })

  },
  mouseDown: function () {
    const {interaction, elementManager, selection, cursor} = this
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
    }/* else if (dragMode) {
      this.subTool = dragging
      const id = _hoveredElement.id

      if (!this.editor.selection.has(id)) {
        action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([_hoveredElement.id])})
      }

      interaction._draggingElements = elementManager.getElementsByIdSet(selection.values)
    } */ else {
      // this.subTool = selecting
    }
  },
  mouseMove() {
    const {interaction, cursor} = this

    if (!this.subTool) {
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

    this.subTool?.mouseMove.call(this)
  },
  mouseUp() {
    if (!this.subTool) return

    this.subTool.mouseUp.call(this)
    this.editor.interaction._rotateData = null
    this.subTool = null
  },
}

export default selector