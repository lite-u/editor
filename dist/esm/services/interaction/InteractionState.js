import { createWith, getManipulationBox } from '../../lib/lib.js';
import { getAnchorsByBoundingRect, getBoundingRectFromBoundingRects } from '../tool/resize/helper.js';
import { DEFAULT_FILL, DEFAULT_STROKE } from '../../elements/defaultProps.js';
class InteractionState {
    editor;
    state = 'static';
    mouseStart = { x: 0, y: 0 };
    mouseCurrent = { x: 0, y: 0 };
    mouseDelta = { x: 0, y: 0 };
    mouseWorldStart = { x: 0, y: 0 };
    mouseWorldCurrent = { x: 0, y: 0 };
    mouseWorldDelta = { x: 0, y: 0 };
    _hoveredElement = null;
    operationHandlers = [];
    _pointDown = false;
    _snapped = false;
    _snappedPoint = null;
    _pointHit = null;
    _outlineElement = null;
    _draggingElements = [];
    _manipulationElements = [];
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
    boxColor = '#006bfa';
    boxBgColor = 'rgba(31,180,255,0.1)';
    // toolMap: Map<string, ToolManager> = new Map()
    copyDeltaX = 10;
    copyDeltaY = 10;
    // initialized: boolean = false
    // currentToolName: string = 'selector'
    constructor(editor) {
        this.editor = editor;
        this.selectionBox = createWith('div', 'selection-box', editor.id, {
            display: 'none',
            pointerEvents: 'none',
            position: 'absolute',
            border: `1px dashed ${this.boxColor}`,
            // backgroundColor: `${this.boxBgColor}`,
            backgroundColor: 'transparent',
            zIndex: '10',
        });
        editor.container.appendChild(this.selectionBox);
    }
    hideSelectionBox() {
        this.selectionBox.style.display = 'none';
    }
    updateSelectionBox({ x, y, height, width }) {
        this.selectionBox.style.transform = `translate(${x}px, ${y}px)`;
        this.selectionBox.style.width = width + 'px';
        this.selectionBox.style.height = height + 'px';
        this.selectionBox.style.display = 'block';
    }
    updateControlPoints() {
        const { scale, dpr } = this.editor.world;
        const ratio = scale * dpr;
        const idSet = this.editor.selection.values;
        if (idSet.size <= 1) {
            this._outlineElement = null;
        }
        let rotations = [];
        const elements = this.editor.elementManager.getElementsByIdSet(idSet);
        const rects = elements.map((ele) => {
            rotations.push(ele.rotation);
            return ele.getBoundingRect();
        });
        const rect = getBoundingRectFromBoundingRects(rects);
        const anchors = getAnchorsByBoundingRect(rect);
        const sameRotation = rotations.every(val => val === rotations[0]);
        // const manipulationBox =
        const outlineElementProps = {
            type: 'rectangle',
            ...rect,
            stroke: {
                ...DEFAULT_STROKE,
                // weight: 1 / ratio,
                weight: 1 / ratio,
                color: 'red',
            },
            fill: {
                ...DEFAULT_FILL,
                // enabled: true,
                color: 'green',
            },
        };
        // create outline rectangle for multiple selection
        this._manipulationElements = getManipulationBox(rect, sameRotation ? rotations[0] : 0, ratio);
        this._outlineElement = this.editor.elementManager.create(outlineElementProps);
    }
    destroy() {
        this.selectionBox?.remove();
        this.selectionBox = null;
    }
}
export default InteractionState;
