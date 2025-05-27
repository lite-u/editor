import ToolManager, {ToolType} from '~/services/tool/toolManager'
import resizeFunc from '~/services/tool/resize/resizeFunc'
import ElementLineSegment from '~/elements/lines/lineSegment'

const lineSegmentTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {mainHost, interaction, world} = this.editor
    const {x, y} = interaction.mouseWorldCurrent
    let lineLen = 1
    const cx = x + lineLen / 2
    const cy = y + lineLen / 2

    const ele = ElementLineSegment.create('lineSegment-creating', x - cx, y - cy, x - cx + lineLen, y - cy + lineLen)
    // const ele: ElementRectangle = mainHost.create(eleProps)

    ele.render(world.creationCanvasContext)
    interaction._ele = ele
  },
  mouseMove(this: ToolManager) {
    const {action, interaction, world} = this.editor

    if (!interaction._ele) return
    action.dispatch('clear-creation')

    resizeFunc.call(this, [interaction._ele], 'br')
    interaction._ele.render(world.creationCanvasContext)
  },
  mouseUp(this: ToolManager) {
    const {action, interaction} = this.editor

    const eleProps = interaction._ele.toMinimalJSON()

    action.dispatch('element-add', [eleProps])
    interaction._ele = null!
  },
}

export default lineSegmentTool