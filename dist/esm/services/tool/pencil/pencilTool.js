import { convertPointsToBezierPoints, drawLine } from './helper.js';
const _drawingPoints = [];
let _lastPoint = null;
const pencilTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { creationCanvasContext: ctx } = this.editor.world;
        const point = { ...this.editor.interaction.mouseWorldCurrent };
        this.editor.action.dispatch('clear-creation');
        _drawingPoints.push(point);
        _lastPoint = { ...point };
        drawLine(ctx, _lastPoint, point);
    },
    mouseMove() {
        if (!this.editor.interaction._pointDown)
            return;
        const point = { ...this.editor.interaction.mouseWorldCurrent };
        _drawingPoints.push(point);
        drawLine(this.editor.world.creationCanvasContext, _lastPoint, point);
        _lastPoint = point;
    },
    mouseUp() {
        const { interaction, action } = this.editor;
        const { center, points, closed } = convertPointsToBezierPoints(_drawingPoints);
        console.log(points[0]);
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
