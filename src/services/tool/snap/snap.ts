import ToolManager from '~/services/tool/toolManager'
import {PointHit} from '~/services/interaction/InteractionState'

function snapTool(this: ToolManager) {
  const {interaction} = this.editor
  let _ele = null
  let _snappedPoint = null

  // update
  if (_snappedPoint) {
    interaction._snappedPoint = _snappedPoint as PointHit
  } else if (interaction._snappedPoint) {
    // try to detach from snap point
    const dx = Math.abs(interaction.mouseWorldCurrent.x - interaction._snappedPoint.x)
    const dy = Math.abs(interaction.mouseWorldCurrent.y - interaction._snappedPoint.y)

    if (dx > .5 || dy > .5) {
      interaction._snappedPoint = null
    }

    interaction._snappedPoint = null
  }
}

export default snapTool