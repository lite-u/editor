import {UID} from '~/core/core'
import {OperationHandlers, ResizeHandler} from '~/services/selection/type'
import {ViewportManipulationType} from '~/services/viewport/Viewport'
import {ToolManager} from '~/services/tools/toolManager'

class InteractionState {
  draggingModules: Set<UID> = new Set()
  _selectingModules: Set<UID> = new Set()
  _deselection: UID | null = null
  _resizingOperator: ResizeHandler | null = null
  _rotatingOperator: OperationHandlers | null = null
  selectedShadow: Set<UID> = new Set()
  manipulationStatus: ViewportManipulationType = 'static'
  toolMap: Map<string, ToolManager> = new Map()
  CopyDeltaX = 50
  CopyDeltaY = 100
  // initialized: boolean = false
  // currentToolName: string = 'selector'
}

export default InteractionState