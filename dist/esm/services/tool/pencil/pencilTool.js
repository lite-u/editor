import { convertPointsToBezierPoints, drawLine } from './helper.js';
const points = [];
let _lastPoint = null;
const pencilTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { creationCanvasContext: ctx } = this.editor.world;
        const point = { ...this.editor.interaction.mouseWorldCurrent };
        this.editor.action.dispatch('clear-creation');
        points.push(point);
        _lastPoint = { ...point };
        drawLine(ctx, _lastPoint, point);
    },
    mouseMove() {
        if (!this.editor.interaction._pointDown)
            return;
        const point = { ...this.editor.interaction.mouseWorldCurrent };
        points.push(point);
        drawLine(this.editor.world.creationCanvasContext, _lastPoint, point);
        _lastPoint = point;
    },
    mouseUp() {
        const { interaction, action } = this.editor;
        const eleProps = {
            type: 'path',
            points: convertPointsToBezierPoints(points),
            closed: false,
        };
        action.dispatch('element-add', [eleProps]);
        points.length = 0;
        _lastPoint = null;
        interaction._ele = null;
        action.dispatch('clear-creation');
    },
};
export default pencilTool;
