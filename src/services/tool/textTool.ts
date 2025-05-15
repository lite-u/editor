import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import resizeTool from '~/services/tool/resize/resizeTool'
import {TextProps} from '~/elements/text/text'
import {DEFAULT_FILL, DEFAULT_FONT, DEFAULT_STROKE} from '~/elements/defaultProps'

const textTool: ToolType = {
  cursor: 'text',
  mouseDown(this: ToolManager) {
    const {elementManager, interaction, action, selection} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const width = 1
    const height = 1
    const id = 'rectangle-' + nid()
    const eleProps: TextProps = {
      type: 'text',
      content: [{
        text: 'hello',
        font: {...DEFAULT_FONT},
        fill: {...DEFAULT_FILL},
        stroke: {...DEFAULT_STROKE},
      }],
      cx: x - width / 2,
      cy: y - height / 2,
      width,
      height,
      id,
      layer: 0,
    }

    const ele: ElementRectangle = elementManager.add(elementManager.create(eleProps))

    interaction._ele = ele
    action.dispatch('selection-clear')
    selection.replace(new Set([ele.id]))
    action.dispatch('visible-element-updated')
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._ele) return
    resizeTool.call(this, [this.editor.interaction._ele], 'br')
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._ele = null
  },
}

export default textTool