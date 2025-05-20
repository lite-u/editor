import ToolManager from '~/services/tool/toolManager'
import {isPointNearStroke2} from '~/services/tool/helper'

function detectTool(this: ToolManager) {
  const {interaction, world, visible} = this.editor
  const {baseCanvasContext: ctx, scale, dpr} = world
  const {x, y} = interaction.mouseCurrent
  const viewPoint = {
    x: x * dpr,
    y: y * dpr,
  }
  const arr = visible.values
  // let _ele = null
  interaction._hoveredElement = null

  for (let i = arr.length - 1; i >= 0; i--) {
    const ele = arr[i]
    const path = ele.path2D
    if (!ele.show || ele.opacity <= 0 || interaction._draggingElements.includes(ele)) continue

    const lineWidth = 1 * dpr / scale
    const isNearStroke = isPointNearStroke2(ctx, path, viewPoint, 0, lineWidth)
    const inside = ctx.isPointInPath(path, viewPoint.x, viewPoint.y)

    if (isNearStroke) {
      interaction._hoveredElement = ele
    } else if (inside && ele.fill.enabled) {
      interaction._hoveredElement = ele
    }
  }
}

export default detectTool