class InteractionState {
    draggingModules = new Set();
    _selectingModules = new Set();
    _deselection = null;
    _resizingOperator = null;
    _rotatingOperator = null;
    selectedShadow = new Set();
    manipulationStatus = 'static';
    toolMap = new Map();
    CopyDeltaX = 50;
    CopyDeltaY = 100;
}
export default InteractionState;
