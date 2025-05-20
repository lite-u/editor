import ToolManager, {ToolType} from '~/services/tool/toolManager'
import ElementRectangle from '~/elements/rectangle/rectangle'
import resizeFunc from '~/services/tool/resize/resizeFunc'
import {PropsWithoutIdentifiers} from '~/elements/type'

const rectangleTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {elementManager, interaction, world} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const width = 1
    const height = 1
    const rectProps: PropsWithoutIdentifiers<'rectangle'> = {
      type: 'rectangle',
      cx: x - width / 2,
      cy: y - height / 2,
      width,
      height,
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

export default rectangleTool