import { convertPointsToBezierPoints, drawLine } from './helper.js';
const _drawingPoints = [];
let _lastPoint = null;
const pencilTool = {
    cursor: 'crosshair',
    mouseDown: function () {
        const { action, cursor, overlayHost, world, interaction } = this.editor;
        const { scale, dpr, offset } = world;
        const point = { ...interaction.mouseWorldCurrent };
        cursor.lock();
        // action.dispatch('clear-creation')
        _drawingPoints.push(point);
        _lastPoint = { ...point };
        drawLine(overlayHost.ctx, _lastPoint, point, offset, 1 * dpr / scale);
    },
    mouseMove: function () {
        const { action, cursor, overlayHost, world, interaction } = this.editor;
        if (!interaction._pointDown)
            return;
        const point = { ...interaction.mouseWorldCurrent };
        const { scale, dpr, offset } = world;
        _drawingPoints.push(point);
        drawLine(overlayHost.ctx, point, point, offset, 1 * dpr / scale);
        _lastPoint = point;
    },
    mouseUp: function () {
        const { interaction, cursor, action } = this.editor;
        const { center, points, closed } = convertPointsToBezierPoints(_drawingPoints);
        const eleProps = {
            type: 'path',
            cx: center.x,
            cy: center.y,
            points,
            closed,
        };
        cursor.unlock();
        action.dispatch('element-add', [eleProps]);
        _drawingPoints.length = 0;
        _lastPoint = null;
        interaction._ele = null;
        // action.dispatch('clear-creation')
    },
};
export default pencilTool;
