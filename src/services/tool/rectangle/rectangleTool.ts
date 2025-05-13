import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import ElementRectangle, {RectangleProps} from '~/elements/rectangle/rectangle'

const rectangleTool: ToolType = {
  cursor: 'rectangle',
  start(this: ToolManager, e: MouseEvent) {
    const {
      elementManager, interaction, action, selection,
    } = this.editor
    const {x, y} = interaction.mouseCurrent
    const {x: cx, y: cy} = this.editor.world.getWorldPointByViewportPoint(x, y)
    const width = 2
    const height = 2
    // this._resizingOperator = operator
    const id = 'rectangle-' + nid()
    const rectProps: RectangleProps = {
      type: 'rectangle',
      cx: cx - width / 2,
      cy: cy - height / 2,
      width,
      height,
      id,
      layer: 0,
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
    const {mouseCurrent, mouseStart} = interaction
    const dx = mouseCurrent.x - mouseStart.x
    const dy = mouseCurrent.y - mouseStart.y
    this.editor.container.setPointerCapture(e.pointerId)

    interaction._ele.scaleFrom(dx, dy)
    console.log(dx, dy)
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