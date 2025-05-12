class InteractionState {
    mouseDownPoint = { x: 0, y: 0 };
    mouseMovePoint = { x: 0, y: 0 };
    hoveredModule = '';
    operationHandlers = [];
    draggingModules = new Set();
    _selectingModules = new Set();
    _deselection = null;
    _resizingOperator = null;
    _rotatingOperator = null;
    selectedShadow = new Set();
    manipulationStatus = 'static';
    // toolMap: Map<string, ToolManager> = new Map()
    CopyDeltaX = 50;
    CopyDeltaY = 100;
    // initialized: boolean = false
    // currentToolName: string = 'selector'
    constructor() {
    }
}
export default InteractionState;
