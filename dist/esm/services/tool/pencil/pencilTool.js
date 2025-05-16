import nid from '../../../core/nid.js';
import { convertPointsToBezierPoints, drawLine } from './helper.js';
const points = [];
let _lastPoint = null;
const pencilTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { creationCanvasContext: ctx } = this.editor.world;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const point = { x, y };
        points.push(point);
        _lastPoint = { ...point };
        drawLine(ctx, _lastPoint, point);
    },
    mouseMove() {
        if (!this.editor.interaction._pointDown)
            return;
        const { creationCanvasContext: ctx } = this.editor.world;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const point = { x, y };
        points.push(point);
        drawLine(ctx, _lastPoint, point);
        _lastPoint = { ...point };
    },
    mouseUp() {
        const { elementManager, interaction, action, selection } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const id = 'rectangle-' + nid();
        interaction._ele = null;
        // const b = convertPointsToBezierPoints(points)
        const eleProps = {
            id,
            layer: 0,
            type: 'path',
            points: convertPointsToBezierPoints(points),
        };
        // const ele: ElementPath = elementManager.add(elementManager.create(eleProps))
        console.log(eleProps);
        action.dispatch('element-add', [eleProps]);
        action.dispatch('visible-element-updated');
        // interaction._ele = ele
        action.dispatch('selection-clear');
    },
};
export default pencilTool;
