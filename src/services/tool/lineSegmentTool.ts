import ToolManager, {ToolType} from '~/services/tool/toolManager'
import resizeFunc from '~/services/tool/resize/resizeFunc'
import ElementLineSegment from '~/elements/lines/lineSegment'

const lineSegmentTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {mainHost, action, cursor, overlayHost, interaction, world} = this.editor
    const {x, y} = interaction.mouseWorldCurrent
    let lineLen = 1
    const cx = x + lineLen / 2
    const cy = y + lineLen / 2

    const ele = ElementLineSegment.create('lineSegment-creating', cx, cy, x - cx + lineLen, y - cy + lineLen)
    // const ele: ElementRectangle = mainHost.create(eleProps)

    cursor.lock()
    action.dispatch('rerender-overlay')
    ele.render(overlayHost.ctx)
    interaction._ele = ele
  },
  mouseMove(this: ToolManager) {
    const {action, interaction, cursor, overlayHost, world} = this.editor

    if (!interaction._ele) return

    action.dispatch('clear-creation')

    resizeFunc.call(this, [interaction._ele], 'br')
    action.dispatch('rerender-overlay')
    interaction._ele.render(overlayHost.ctx)
  },
  mouseUp(this: ToolManager) {
    const {action, interaction, cursor} = this.editor

    const eleProps = interaction._ele.toMinimalJSON()

    cursor.unlock()
    action.dispatch('element-add', [eleProps])
    interaction._ele = null!
  },
}

export default lineSegmentTool