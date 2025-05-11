import { UID } from '~/core/core';
import { OperationHandlers, ResizeHandler } from '~/services/selection/type';
import { ViewportManipulationType } from '~/services/viewport/Viewport';
import { ToolManager } from '~/services/tools/toolManager';
declare class InteractionState {
    draggingModules: Set<UID>;
    _selectingModules: Set<UID>;
    _deselection: UID | null;
    _resizingOperator: ResizeHandler | null;
    _rotatingOperator: OperationHandlers | null;
    selectedShadow: Set<UID>;
    manipulationStatus: ViewportManipulationType;
    toolMap: Map<string, ToolManager>;
    CopyDeltaX: number;
    CopyDeltaY: number;
}
export default InteractionState;
