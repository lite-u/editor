import {generateBoundingRectFromTwoPoints} from '~/core/utils'
import {areSetsEqual, getSymmetricDifference} from '~/lib/lib'
import {getResizeCursor, getRotateAngle} from '~/services/tool/selector/helper'
import {BoundingRect, UID} from '~/type'
import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import {detectHoveredElement} from '~/services/tool/helper'

let _mouseMoved = false
const dragging: SubToolType = {
  cursor: 'drag',
  mouseMove(this: ToolManager) {
    _mouseMoved = true

    

  },
  mouseUp(this: ToolManager, {button}) {
    _mouseMoved = false
  },
}

export default dragging