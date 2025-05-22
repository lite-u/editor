import { convertPointsToBezierPoints, drawLine } from './helper.js';
const _drawingPoints = [];
let _lastPoint = null;
const pencilTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { creationCanvasContext: ctx, scale, dpr } = this.editor.world;
        const point = { ...this.editor.interaction.mouseWorldCurrent };
        this.editor.action.dispatch('clear-creation');
        _drawingPoints.push(point);
        _lastPoint = { ...point };
        drawLine(ctx, _lastPoint, point, 1 / scale * dpr);
    },
    mouseMove() {
        if (!this.editor.interaction._pointDown)
            return;
        const point = { ...this.editor.interaction.mouseWorldCurrent };
        const { creationCanvasContext: ctx, scale, dpr } = this.editor.world;
        _drawingPoints.push(point);
        drawLine(ctx, _lastPoint, point, 1 / scale * dpr);
        _lastPoint = point;
    },
    mouseUp() {
        const { interaction, action } = this.editor;
        const { center, points, closed } = convertPointsToBezierPoints(_drawingPoints);
        const eleProps = {
            type: 'path',
            cx: center.x,
            cy: center.y,
            points,
            closed,
        };
        action.dispatch('element-add', [eleProps]);
        // console.log(points,_lastPoint)
        _drawingPoints.length = 0;
        _lastPoint = null;
        interaction._ele = null;
        action.dispatch('clear-creation');
    },
};
export default pencilTool;
