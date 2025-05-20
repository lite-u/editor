import ToolManager, {ToolType} from '~/services/tool/toolManager'
import resizeFunc from '~/services/tool/resize/resizeFunc'
import {PropsWithoutIdentifiers} from '~/elements/type'
import ElementRectangle from '~/elements/rectangle/rectangle'

const ellipseTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {elementManager, interaction, world} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const r1 = 1
    const r2 = 1
    const rectProps: PropsWithoutIdentifiers<'ellipse'> = {
      type: 'ellipse',
      cx: x - r1 / 2,
      cy: y - r2 / 2,
      r1,
      r2,
    }
    const ele: ElementRectangle = elementManager.create(rectProps)

    ele.render(world.creationCanvasContext)
    interaction._ele = ele
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._ele) return
    this.editor.action.dispatch('clear-creation')

    resizeFunc.call(this, [this.editor.interaction._ele], 'br')
    this.editor.interaction._ele.render(this.editor.world.creationCanvasContext)
  },
  mouseUp(this: ToolManager) {
    const eleProps = this.editor.interaction._ele.toMinimalJSON()

    this.editor.action.dispatch('element-add', [eleProps])
    this.editor.interaction._ele = null
  },
}

export default ellipseTool