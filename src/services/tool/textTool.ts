import ToolManager, {ToolType} from '~/services/tool/toolManager'
import ElementRectangle from '~/elements/rectangle/rectangle'
import resizeTool from '~/services/tool/resize/resizeTool'
import {DEFAULT_FONT, DEFAULT_STROKE, DEFAULT_TEXT_FILL} from '~/elements/defaultProps'
import {PropsWithoutIdentifiers} from '~/elements/type'

const textTool: ToolType = {
  cursor: 'text',
  mouseDown(this: ToolManager) {

    const {elementManager, interaction, world} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const width = 1
    const height = 1
    const eleProps: PropsWithoutIdentifiers<'text'> = {
      type: 'text',
      content: [{
        text: 'hello',
        font: {...DEFAULT_FONT},
        fill: {...DEFAULT_TEXT_FILL},
        stroke: {...DEFAULT_STROKE},
      }],
      cx: x - width / 2,
      cy: y - height / 2,
      width,
      height,
    }
    const ele: ElementRectangle = elementManager.create(eleProps)

    ele.render(world.creationCanvasContext)
    interaction._ele = ele
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._ele) return
    this.editor.action.dispatch('clear-creation')

    resizeTool.call(this, [this.editor.interaction._ele], 'br')
    this.editor.interaction._ele.render(this.editor.world.creationCanvasContext)
  },
  mouseUp(this: ToolManager) {
    const eleProps = this.editor.interaction._ele.toMinimalJSON()

    this.editor.action.dispatch('element-add', [eleProps])
    this.editor.interaction._ele = null
  },
}

export default textTool