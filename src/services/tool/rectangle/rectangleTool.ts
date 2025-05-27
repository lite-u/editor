import {ToolType} from '~/services/tool/toolManager'
import ElementRectangle from '~/elements/rectangle/rectangle'
import resizeFunc from '~/services/tool/resize/resizeFunc'
import {PropsWithoutIdentifiers} from '~/elements/type'

const rectangleTool: ToolType = {
  cursor: 'crosshair',
  mouseDown() {
    const {mainHost, interaction, world} = this
    const {x, y} = this.interaction.mouseWorldCurrent
    const width = 1
    const height = 1
    const rectProps: PropsWithoutIdentifiers<'rectangle'> = {
      type: 'rectangle',
      cx: x - width / 2,
      cy: y - height / 2,
      width,
      height,
    }
    const ele: ElementRectangle = mainHost.create(rectProps)

    ele.render(world.creationCanvasContext)
    interaction._ele = ele
  },
  mouseMove() {
    if (!this.interaction._ele) return
    this.action.dispatch('clear-creation')

    resizeFunc.call(this, [this.interaction._ele], 'br')
    this.interaction._ele.render(this.world.creationCanvasContext)
  },
  mouseUp() {
    const eleProps = this.interaction._ele.toMinimalJSON()
    console.log(eleProps)
    this.action.dispatch('element-add', [eleProps])
    this.interaction._ele = null
  },
}

export default rectangleTool