import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import {ElementProps} from '~/elements/type'
import ElementRectangle from '~/elements/rectangle/rectangle'

const rectangleTool: ToolType = {
  cursor: 'rectangle',
  start(this: ToolManager, e: MouseEvent) {
    const {
      elementManager, interaction, action, selection,
    } = this.editor
    const {x, y} = interaction.mouseMove
    const {x: cx, y: cy} = this.editor.world.getWorldPointByViewportPoint(x, y)
    const width = 2
    const height = 2
    // this._resizingOperator = operator
    const id = 'rectangle-' + nid()
    const rectProps: ElementProps = {
      type: 'rectangle',
      id,
      layer: 0,
      lineColor: '#000',
      fillColor: '#fff',
      lineWidth: 1,
      opacity: 100,
      cx: cx - width / 2,
      cy: cy - height / 2,
      width,
      height,
    }

    const ele: ElementRectangle = elementManager.add(elementManager.create(rectProps))

    interaction.state = 'resizing'
    interaction._ele = ele
    action.dispatch('selection-clear')
    selection.replace(new Set([ele.id]))
    action.dispatch('visible-element-updated')

    // const r = this.editor.interaction.operationHandlers.find(o => o.type === 'resize' && o.name === 'br')

    /*  if (r) {
        this.editor.interaction._resizingOperator = r as ResizeHandle
      }*/
  },
  move(this: ToolManager, e: PointerEvent) {
    // if (!this.editor.interaction._resizingOperator) return
    const {altKey, shiftKey} = e
    const {interaction, world, selection, action, elementManager, rect} = this.editor
    const {mouseMove, mouseStart} = interaction
    const dx = mouseMove.x - mouseStart.x
    const dy = mouseMove.y - mouseStart.y
    this.editor.container.setPointerCapture(e.pointerId)

    interaction._ele.translate(dx, dy)
    console.log(dx,dy)
    action.dispatch('visible-element-updated')

    // const r = applyResize.call(this, altKey, shiftKey)
    /*    this.editor.action.dispatch('element-modifying', {
          type: 'resize',
          data: r,
        })*/

  },
  finish(this: ToolManager, e: MouseEvent) {

  },
}

export default rectangleTool