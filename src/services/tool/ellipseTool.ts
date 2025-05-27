import {ToolType} from '~/services/tool/toolManager'
import resizeFunc from '~/services/tool/resize/resizeFunc'
import {PropsWithoutIdentifiers} from '~/elements/type'
import ElementRectangle from '~/elements/rectangle/rectangle'

const ellipseTool: ToolType = {
  cursor: 'crosshair',
  mouseDown: function () {
    const {mainHost, interaction, world} = this.editor
    const {x, y} = interaction.mouseWorldCurrent
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
    const {mainHost, action,interaction, world} = this.editor

    if (!interaction._ele) return
    action.dispatch('clear-creation')

    resizeFunc.call(this, [interaction._ele], 'br')
    interaction._ele.render(world.creationCanvasContext)
  },
  mouseUp: function () {
    const {mainHost, action,interaction, world} = this.editor

    const eleProps = interaction._ele.toMinimalJSON()

    action.dispatch('element-add', [eleProps])
    interaction._ele = null
  },
}

export default ellipseTool