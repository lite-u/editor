import { createWith, getManipulationBox } from '../../lib/lib.js';
import { getBoundingRectFromBoundingRects } from '../tool/resize/helper.js';
import { DEFAULT_STROKE } from '../../elements/defaultProps.js';
import { getMinimalBoundingRect } from '../../core/utils.js';
import Rectangle from '../../elements/rectangle/rectangle.js';
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
    _hoveredResizeManipulator = null;
    _hoveredRotateManipulator = null;
    _draggingElements = [];
    _resizingElements = [];
    _resizingData = null;
    _rotateData = null;
    operationHandlers = [];
    _pointDown = false;
    _snapped = false;
    _snappedPoint = null;
    _pointHit = null;
    _outlineElement = null;
    _manipulationElements = [];
    // _creatingElementId: UID
    // _ele: Set<UID> = new Set()
    _selectingElements = new Set();
    _deselection = null;
    // _resizingOperator: ResizeHandle | null = null
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
        const { elementManager } = this.editor;
        const { scale, dpr } = this.editor.world;
        const ratio = scale * dpr;
        const idSet = this.editor.selection.values;
        const pointLen = 20 / ratio;
        // const pointRadius = pointLen / 2
        if (idSet.size <= 1) {
            this._outlineElement = null;
        }
        let rotations = [];
        const elements = this.editor.elementManager.getElementsByIdSet(idSet);
        this._manipulationElements = [];
        if (elements.length === 0) {
            this._outlineElement = null;
            return;
        }
        const rectsWithRotation = [];
        const rectsWithoutRotation = [];
        elements.forEach((ele) => {
            // debugger
            const clone = elementManager.create(ele.toMinimalJSON());
            const centerPoint = new Rectangle({
                id: 'handle-move-center',
                layer: 1,
                rotation: ele.rotation,
                type: 'rectangle',
                width: pointLen,
                height: pointLen,
                cx: ele.cx,
                cy: ele.cy,
            });
            centerPoint.stroke.enabled = false;
            centerPoint.fill.enabled = true;
            centerPoint.fill.color = 'orange';
            // centerPoint._relatedId = ele.id
            clone.fill.enabled = false;
            clone.stroke.enabled = true;
            clone.stroke.weight = 2 / scale;
            clone.stroke.color = '#5491f8';
            // clone._relatedId = ele.id
            this._manipulationElements.push(clone, centerPoint);
            rotations.push(ele.rotation);
            rectsWithRotation.push(ele.getBoundingRect());
            rectsWithoutRotation.push(ele.getBoundingRect(true));
        });
        const sameRotation = rotations.every(val => val === rotations[0]);
        const applyRotation = sameRotation ? rotations[0] : 0;
        let rect;
        const specialLineSeg = idSet.size === 1 && elements[0].type === 'lineSegment';
        if (sameRotation) {
            rect = getMinimalBoundingRect(rectsWithoutRotation, applyRotation);
            if (specialLineSeg) {
                rect.width = 1;
                rect.cx = elements[0].cx;
            }
            this._manipulationElements.push(...getManipulationBox(rect, applyRotation, ratio, specialLineSeg));
        }
        else {
            rect = getBoundingRectFromBoundingRects(rectsWithRotation);
            this._manipulationElements.push(...getManipulationBox(rect, 0, ratio, specialLineSeg));
        }
        this._outlineElement = new Rectangle({
            id: 'selected-elements-outline',
            layer: 0,
            show: !specialLineSeg,
            type: 'rectangle',
            ...rect,
            rotation: applyRotation,
            stroke: {
                ...DEFAULT_STROKE,
                weight: 2 / scale,
                color: '#5491f8',
            },
        });
    }
    destroy() {
        this.selectionBox?.remove();
        this.selectionBox = null;
    }
}
export default InteractionState;
