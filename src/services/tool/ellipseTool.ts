import {ToolType} from '~/services/tool/toolManager'
import resizeFunc from '~/services/tool/resize/resizeFunc'
import {PropsWithoutIdentifiers} from '~/elements/type'
import ElementRectangle from '~/elements/rectangle/rectangle'

const ellipseTool: ToolType = {
  cursor: 'crosshair',
  mouseDown: function () {
    const {mainHost, interaction, world} = this
    const {x, y} = this.interaction.mouseWorldCurrent
    const r1 = 1
    const r2 = 1
    const rectProps: PropsWithoutIdentifiers<'ellipse'> = {
      type: 'ellipse',
      cx: x - r1 / 2,
      cy: y - r2 / 2,
      r1,
      r2,
    }
    const ele: ElementRectangle = mainHost.create(rectProps)

    ele.render(world.creationCanvasContext)
    interaction._ele = ele
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
    this.interaction._ele = null
  },
}

export default ellipseTool