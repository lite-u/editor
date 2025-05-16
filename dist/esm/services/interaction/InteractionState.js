import { createWith } from '../../lib/lib.js';
class InteractionState {
    editor;
    state = 'static';
    mouseStart = { x: 0, y: 0 };
    mouseCurrent = { x: 0, y: 0 };
    mouseDelta = { x: 0, y: 0 };
    mouseWorldStart = { x: 0, y: 0 };
    mouseWorldCurrent = { x: 0, y: 0 };
    mouseWorldDelta = { x: 0, y: 0 };
    hoveredElement = '';
    operationHandlers = [];
    _pointDown = false;
    _snapped = false;
    _pointHit = null;
    // spaceKeyDown = false
    // _creatingElementId: UID
    // _ele: Set<UID> = new Set()
    _selectingElements = new Set();
    _deselection = null;
    _resizingOperator = null;
    _rotatingOperator = null;
    selectedShadow = new Set();
    _ele;
    _modifier = {
        button: -2,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        movementX: 0,
        movementY: 0,
    };
    selectionBox = null;
    _lastTool = null;
    boxColor = '#1FB3FF';
    boxBgColor = 'rgba(31,180,255,0.1)';
    // toolMap: Map<string, ToolManager> = new Map()
    // CopyDeltaX = 50
    // CopyDeltaY = 100
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
            zIndex: '10',
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
