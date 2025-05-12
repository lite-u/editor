import { createWith } from '../../lib/lib.js';
class InteractionState {
    editor;
    mouseDownPoint = { x: 0, y: 0 };
    mouseMovePoint = { x: 0, y: 0 };
    hoveredModule = '';
    operationHandlers = [];
    spaceKeyDown = false;
    draggingModules = new Set();
    _selectingModules = new Set();
    _deselection = null;
    _resizingOperator = null;
    _rotatingOperator = null;
    selectedShadow = new Set();
    manipulationStatus = 'static';
    selectionBox = null;
    _lastTool = null;
    boxColor = '#1FB3FF';
    boxBgColor = 'rgba(31,180,255,0.1)';
    // toolMap: Map<string, ToolManager> = new Map()
    CopyDeltaX = 50;
    CopyDeltaY = 100;
    // initialized: boolean = false
    // currentToolName: string = 'selector'
    constructor(editor) {
        this.editor = editor;
        this.selectionBox = createWith('div', 'selection-box', editor.id, {
            display: 'none',
            pointerEvents: 'none',
            position: 'absolute',
            border: `1px solid ${this.boxColor}`,
            backgroundColor: `${this.boxBgColor}`,
            zIndex: 10,
        });
        editor.container.appendChild(this.selectionBox);
    }
    updateSelectionBox({ x, y, height, width }, show = true) {
        this.selectionBox.style.transform = `translate(${x}px, ${y}px)`;
        this.selectionBox.style.width = width + 'px';
        this.selectionBox.style.height = height + 'px';
        this.selectionBox.style.display = show ? 'block' : 'none';
    }
    destroy() {
        this.selectionBox?.remove();
        this.selectionBox = null;
    }
}
export default InteractionState;
