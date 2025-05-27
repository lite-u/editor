import {ToolType} from '~/services/tool/toolManager'
import ElementRectangle from '~/elements/rectangle/rectangle'
import resizeFunc from '~/services/tool/resize/resizeFunc'

const rectangleTool: ToolType = {
  cursor: 'crosshair',
  mouseDown() {
    const {mainHost, action, cursor, overlayHost, interaction, world} = this.editor
    const {x, y} = interaction.mouseWorldCurrent
    const width = 1
    const height = 1
    const cx = x - width / 2
    const cy = y - height / 2

    const ele: ElementRectangle = ElementRectangle.create('rectangle-creating', cx, cy, width, height)

    cursor.lock()
    action.dispatch('rerender-overlay')
    ele.render(overlayHost.ctx)
    interaction._ele = ele
  },
  mouseMove() {
    const {action, interaction, cursor, overlayHost, world} = this.editor

    if (!interaction._ele) return

    resizeFunc.call(this, [interaction._ele], 'br')
    action.dispatch('rerender-overlay')
    interaction._ele.render(overlayHost.ctx)
  },
  mouseUp() {
    const {action, interaction, cursor, overlayHost, world} = this.editor

    const eleProps = interaction._ele.toMinimalJSON()
    action.dispatch('element-add', [eleProps])
    interaction._ele = null!
  },
}

export default rectangleTool