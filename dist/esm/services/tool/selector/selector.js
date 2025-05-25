import { getRotateAngle } from './helper.js';
import dragging from './dragging/dragging.js';
import selecting from './selecting/selecting.js';
import ElementRectangle from '../../../elements/rectangle/rectangle.js';
import { getMinimalBoundingRect } from '../../../core/utils.js';
import { getManipulationBox } from '../../../lib/lib.js';
import { getBoundingRectFromBoundingRects } from '../resize/helper.js';
import { DEFAULT_STROKE } from '../../../elements/defaultProps.js';
const selector = {
    cursor: 'default',
    init: function () {
        const { interaction, action, visible, world } = this;
        const { overlayCanvasContext: ctx, scale, dpr } = world;
        // hover style and translate
        visible.getVisibleSelectedElements.forEach(ele => {
            const { id } = ele;
            ele.onmouseenter = () => {
                if (this.selection.has(ele.id))
                    return;
                ctx.save();
                ctx.lineWidth = 1 / this.world.scale * this.world.dpr;
                ctx.strokeStyle = '#5491f8';
                ctx.stroke(ele.path2D);
                ctx.restore();
            };
            ele.onmouseleave = () => {
                action.dispatch('render-overlay');
            };
            ele.onmousedown = () => {
                if (!this.selection.has(id)) {
                    action.dispatch('selection-modify', { mode: 'replace', idSet: new Set([id]) });
                }
                this.toolManager.subTool = dragging;
                interaction._draggingElements = this.elementManager.getElementsByIdSet(this.selection.values);
            };
        });
        // transforms
        // translate
        // scale and rotation
        console.log('updateHandles');
        const { elementManager } = this;
        // const {scale, dpr, overlayCanvasContext: ctx} = this.interaction.editor.world
        const ratio = scale * dpr;
        const idSet = this.interaction.editor.selection.values;
        const pointLen = 20 / ratio;
        const elements = this.interaction.editor.elementManager.getElementsByIdSet(idSet);
        let rotations = [];
        if (elements.length <= 1) {
            this.interaction.selectedOutlineElement = null;
            if (elements.length === 0)
                return;
        }
        this.interaction.transformHandles = [];
        const rectsWithRotation = [];
        const rectsWithoutRotation = [];
        elements.forEach((ele) => {
            // debugger
            // const clone = elementManager.create(ele.toMinimalJSON())
            const centerPoint = ElementRectangle.create('handle-move-center', ele.cx, ele.cy, pointLen);
            centerPoint.stroke.enabled = false;
            centerPoint.fill.enabled = true;
            centerPoint.fill.color = 'orange';
            // centerPoint._relatedId = ele.id
            // clone.fill.enabled = false
            // clone.stroke.enabled = true
            // clone.stroke.weight = 2 / scale
            // clone.stroke.color = '#5491f8'
            // clone._relatedId = ele.id
            this.interaction.transformHandles.push(/*clone, */ centerPoint);
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
            this.interaction.transformHandles.push(...getManipulationBox(rect, applyRotation, ratio, specialLineSeg));
        }
        else {
            rect = getBoundingRectFromBoundingRects(rectsWithRotation);
            this.interaction.transformHandles.push(...getManipulationBox(rect, 0, ratio, specialLineSeg));
        }
        this.interaction.selectedOutlineElement = new ElementRectangle({
            id: 'selected-elements-outline',
            layer: 0,
            show: !specialLineSeg,
            type: 'rectangle',
            ...rect,
            rotation: applyRotation,
            stroke: {
                ...DEFAULT_STROKE,
                weight: 2 / scale,
                color: this.boxColor,
            },
        });
    },
    mouseDown: function () {
        if (!this.toolManager.subTool) {
            this.toolManager.subTool = selecting;
        }
        /* const {interaction, elementManager, selection, cursor} = this
         // const {_hoveredElement} = interaction
    
         const rotateMode = !!interaction._hoveredRotateManipulator
         const resizeMode = !!interaction._hoveredResizeManipulator
    
         if (resizeMode) {
           const placement = interaction._hoveredResizeManipulator.id.replace('handle-resize-', '')
           cursor.set('resize')
           this.subTool = resizing
    
           interaction._resizingData = {placement}
    
           cursor.set('resize')
           this.subTool = resizing
         } else if (rotateMode) {
           const rects = elementManager.getElementsByIdSet(selection.values).map(ele => {
             return ele.getBoundingRect(true)
           })
           const center = getBoundingRectFromBoundingRects(rects)
           const {cx: x, cy: y} = center
    
           console.log(interaction._hoveredElement)
           interaction._rotateData = {startRotation: interaction._outlineElement.rotation, targetPoint: {x, y}}
           this.subTool = rotating
         } */
    },
    mouseMove: function () {
        const { interaction, cursor } = this;
        if (!this.toolManager.subTool) {
            if (interaction._hoveredResizeManipulator) {
                cursor.set('nw-resize');
                // console.log(10)
            }
            else if (interaction._hoveredRotateManipulator) {
                // console.log(interaction._hoveredRotateManipulator.id)
                const centerPoint = {
                    x: interaction.selectedOutlineElement.cx,
                    y: interaction.selectedOutlineElement.cy,
                };
                const rotation = getRotateAngle(centerPoint, interaction.mouseWorldCurrent);
                cursor.set('rotate');
                cursor.rotate(rotation);
                // console.log(10)
            }
            else {
                cursor.set(selector.cursor);
            }
        }
        // if (!this.subTool) return
        this.toolManager.subTool?.mouseMove.call(this);
    },
    mouseUp() {
        this.toolManager.subTool?.mouseUp.call(this);
        this.interaction._rotateData = null;
        this.toolManager.subTool = null;
    },
};
export default selector;
