import nid from '../../../core/nid.js';
import { convertPointsToBezierPoints } from './helper.js';
const points = [];
let _lastPoint = null;
const pencilTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { creationCanvasContext: ctx } = this.editor.world;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        // this.editor.action.dispatch('selection-clear')
        points.push({ x, y });
        _lastPoint = { x, y };
        ctx.save();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 1, y + 1);
        ctx.stroke();
        ctx.restore();
    },
    mouseMove() {
        if (!this.editor.interaction._pointDown)
            return;
        const { creationCanvasContext: ctx } = this.editor.world;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        // this.editor.action.dispatch('selection-clear')
        points.push({ x, y });
        ctx.save();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(_lastPoint.x, _lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
        _lastPoint.x = x;
        _lastPoint.y = y;
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
