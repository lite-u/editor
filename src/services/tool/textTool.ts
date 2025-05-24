import {ToolType} from '~/services/tool/toolManager'
import resizeFunc from '~/services/tool/resize/resizeFunc'
import {DEFAULT_FONT, DEFAULT_STROKE, DEFAULT_TEXT_FILL} from '~/elements/defaultProps'
import {PropsWithoutIdentifiers} from '~/elements/type'

const textTool: ToolType = {
  cursor: 'text',
  mouseDown: function () {
    const {elementManager, interaction, world} = this
    const {x, y} = this.interaction.mouseWorldCurrent
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
    const ele = elementManager.create(eleProps)

    if (ele) {
      ele.render(world.creationCanvasContext)
      interaction._ele = ele
    }
  },
  mouseMove: function () {
    if (!this.interaction._ele) return
    this.action.dispatch('clear-creation')

    resizeFunc.call(this, [this.interaction._ele], 'br')
    this.interaction._ele.render(this.world.creationCanvasContext)
  },
  mouseUp: function () {
    const eleProps = this.interaction._ele.toMinimalJSON()

    this.action.dispatch('element-add', [eleProps])
    this.interaction._ele = null!
  },
}

export default textTool