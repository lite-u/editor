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
        // console.log(points)
        const b = convertPointsToBezierPoints(points);
        console.log(b);
        const eleProps = {
            id,
            layer: 0,
            type: 'lineSegment',
            points: [
                { id: 'start', x, y },
                { id: 'end', x: x + 1, y: y + 1 },
            ],
        };
        const ele = elementManager.add(elementManager.create(eleProps));
        // interaction._ele = ele
        action.dispatch('selection-clear');
    },
};
export default pencilTool;
