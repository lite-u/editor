import ToolManager from '~/services/tool/toolManager'
import {CanvasHostEvent} from '~/services/element/CanvasHost'

function handleMouseUp(this: ToolManager, e: CanvasHostEvent) {
  // const {button, target} = e.originalEvent

  this.tool.mouseUp.call(this)
  this.interaction._pointDown = false
  // this.action.dispatch('clear-creation')
  this.action.dispatch('world-mouse-up')
}

export default handleMouseUp
