import ToolManager, {ToolType} from '~/services/tool/toolManager'
import ElementRectangle from '~/elements/rectangle/rectangle'
import resizeFunc from '~/services/tool/resize/resizeFunc'
import {PropsWithoutIdentifiers} from '~/elements/type'

const lineSegmentTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {mainHost, interaction, world} = this
    const {x, y} = this.interaction.mouseWorldCurrent
    let initialLineLen = 1
    const cx = x + initialLineLen / 2
    const cy = y + initialLineLen / 2
    // const startPoint = {x, y}
    // const endPoint = {x: x + initialLineLen, y: y + initialLineLen}
    const eleProps: PropsWithoutIdentifiers<'lineSegment'> = {
      type: 'lineSegment',
      cx,
      cy,
      points: [
        {id: 'start', x: x - cx, y: y - cy},
        {id: 'end', x: x - cx + initialLineLen, y: y - cy + initialLineLen},
      ],
    }

    const ele: ElementRectangle = mainHost.create(eleProps)

    ele.render(world.creationCanvasContext)
    interaction._ele = ele
  },
  mouseMove(this: ToolManager) {
    if (!this.interaction._ele) return
    this.action.dispatch('clear-creation')

    resizeFunc.call(this, [this.interaction._ele], 'br')
    this.interaction._ele.render(this.world.creationCanvasContext)
  },
  mouseUp(this: ToolManager) {
    const eleProps = this.interaction._ele.toMinimalJSON()

    this.action.dispatch('element-add', [eleProps])
    this.interaction._ele = null
  },
}

export default lineSegmentTool