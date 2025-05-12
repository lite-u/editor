import { UID } from '~/core/core';
import { OperationHandlers, ResizeHandler } from '~/services/selection/type';
import { Point } from '~/type';
export type ViewportManipulationType = 'static' | 'waiting' | 'panning' | 'dragging' | 'resizing' | 'rotating' | 'zooming' | 'selecting';
declare class InteractionState {
    mouseDownPoint: Point;
    mouseMovePoint: Point;
    hoveredModule: UID;
    readonly operationHandlers: OperationHandlers[];
    draggingModules: Set<UID>;
    _selectingModules: Set<UID>;
    _deselection: UID | null;
    _resizingOperator: ResizeHandler | null;
    _rotatingOperator: OperationHandlers | null;
    selectedShadow: Set<UID>;
    manipulationStatus: ViewportManipulationType;
    CopyDeltaX: number;
    CopyDeltaY: number;
    constructor();
}
export default InteractionState;
