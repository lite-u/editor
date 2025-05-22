import { createWith, getManipulationBox } from '~/lib/lib';
import { getBoundingRectFromBoundingRects } from '~/services/tool/resize/helper';
import { DEFAULT_STROKE } from '~/elements/defaultProps';
import { getMinimalBoundingRect } from '~/core/utils';
import Rectangle from '~/elements/rectangle/rectangle';
import Ellipse from '~/elements/ellipse/ellipse';
import LineSegment from '~/elements/lines/lineSegment';
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
    _manipulationElements = [];
    _controlPoints = [];
    operationHandlers = [];
    _pointDown = false;
    _snapped = false;
    _snappedPoint = null;
    _pointHit = null;
    _outlineElement = null;
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
    createTransformHandles() {
        const { elementManager } = this.editor;
        const { scale, dpr } = this.editor.world;
        const ratio = scale * dpr;
        const idSet = this.editor.selection.values;
        const pointLen = 20 / ratio;
        const elements = this.editor.elementManager.getElementsByIdSet(idSet);
        let rotations = [];
        if (elements.length <= 1) {
            this._outlineElement = null;
            if (elements.length === 0)
                return;
        }
        this._manipulationElements = [];
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
    createPathPoints() {
        // const {elementManager} = this.editor
        const { scale, dpr } = this.editor.world;
        const ratio = scale * dpr;
        const idSet = this.editor.selection.values;
        const pointLen = 20 / ratio;
        // const eles = this.editor.visible.values
        const pointElements = [];
        const elements = this.editor.elementManager.getElementsByIdSet(idSet);
        const resizeStrokeWidth = 2 / ratio;
        // console.log(eles)
        elements.forEach(ele => {
            const points = ele.getBezierPoints();
            const { cx, cy } = ele;
            points.forEach((point, index) => {
                const anchorPoint = new Rectangle({
                    id: ele.id + '-anchor-' + index,
                    layer: 1,
                    cx: point.anchor.x + cx,
                    cy: point.anchor.y + cy,
                    width: pointLen,
                    height: pointLen,
                    fill: {
                        enabled: true,
                        color: '#fff',
                    },
                });
                anchorPoint.stroke.weight = resizeStrokeWidth;
                if (point.cp1) {
                    const cPX = point.cp1.x + cx;
                    const cPY = point.cp1.y + cy;
                    const cp1 = new Ellipse({
                        id: ele.id + '-cp1-' + index,
                        layer: 1,
                        cx: cPX,
                        cy: cPY,
                        r1: pointLen,
                        r2: pointLen,
                        fill: {
                            enabled: true,
                            color: this.boxColor,
                        },
                    });
                    const lineCX = (cPX + cx) / 2;
                    const lineCY = (cPY + cy) / 2;
                    const lineToAnchor = new LineSegment({
                        id: ele.id + '-cp1-' + index,
                        layer: 1,
                        cx: lineCX,
                        cy: lineCY,
                        points: [
                            { id: 'start', x: point.cp1.x, y: point.cp1.y },
                            { id: 'end', x: lineCX - cx, y: lineCY - cy },
                        ],
                    });
                    lineToAnchor.stroke.color = '#000000';
                    lineToAnchor.stroke.weight = 1 / ratio;
                    cp1.stroke.enabled = false;
                    pointElements.push(lineToAnchor, cp1);
                }
                pointElements.push(anchorPoint);
            });
        });
        this.editor.interaction._controlPoints = pointElements;
    }
    destroy() {
        this.selectionBox?.remove();
        this.selectionBox = null;
    }
}
export default InteractionState;
