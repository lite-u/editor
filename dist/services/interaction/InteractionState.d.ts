import { OperationHandler } from '~/services/selection/type';
import { Point, Rect, UID } from '~/type';
import Editor from '~/main/editor';
import { ElementInstance } from '~/elements/type';
import { ToolName } from '~/services/tool/toolManager';
export type EditorManipulationType = 'static' | 'waiting' | 'panning' | 'dragging' | 'resizing' | 'rotating' | 'zooming' | 'selecting';
export type Modifier = {
    button: number;
    altKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
    ctrlKey: boolean;
    movementX: number;
    movementY: number;
};
export type PointHit = {
    x: number;
    y: number;
    type: 'center' | 'anchor' | 'path';
};
declare class InteractionState {
    editor: Editor;
    state: EditorManipulationType;
    mouseStart: Point;
    mouseCurrent: Point;
    mouseDelta: Point;
    mouseWorldStart: Point;
    mouseWorldCurrent: Point;
    mouseWorldDelta: Point;
    mouseWorldMovement: Point;
    _hoveredElement: ElementInstance | null;
    _draggingElements: ElementInstance[];
    _resizingElements: ElementInstance[];
    _resizingData: {
        targetPoint?: {
            x: number;
            y: number;
        };
        placement: string;
    } | null;
    _rotateData: {
        startRotation: number;
        snappedRotation?: number;
        targetPoint: {
            x: number;
            y: number;
        };
    } | null;
    _pointDown: boolean;
    _snapped: boolean;
    _snappedPoint: PointHit | null;
    _pointHit: PointHit | null;
    selectedOutlineElement: ElementInstance | null;
    _selectingElements: Set<UID>;
    _deselection: UID | null;
    _rotatingOperator: OperationHandler | null;
    selectedShadow: Set<UID>;
    _ele: ElementInstance;
    _modifier: Modifier;
    selectionBox: HTMLDivElement | null;
    _lastTool: ToolName | null;
    boxColor: string;
    boxBgColor: string;
    copyDeltaX: number;
    copyDeltaY: number;
    constructor(editor: Editor);
    hideSelectionBox(): void;
    updateSelectionBox({ x, y, height, width }: Rect): void;
    destroy(): void;
}
export default InteractionState;
