"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("~/services/tool/pencil/helper");
const _drawingPoints = [];
let _lastPoint = null;
const pencilTool = {
    cursor: 'pencil',
    mouseDown: function () {
        const { action, cursor, overlayHost, world, interaction } = this.editor;
        const { scale, dpr, offset } = world;
        const point = Object.assign({}, interaction.mouseWorldCurrent);
        cursor.lock();
        overlayHost.lock();
        // console.log(interaction.mouseWorldCurrent)
        _drawingPoints.push(point);
        _lastPoint = Object.assign({}, point);
        (0, helper_1.drawLine)(overlayHost.ctx, _lastPoint, point, 1 * dpr / scale);
    },
    mouseMove: function () {
        const { action, cursor, overlayHost, world, interaction } = this.editor;
        if (!_lastPoint)
            return;
        const point = Object.assign({}, interaction.mouseWorldCurrent);
        const { scale, dpr, offset } = world;
        // console.log(overlayHost.ctx)
        // console.log(overlayHost.ctx.canvas)
        // console.log([..._drawingPoints])
        _drawingPoints.push(point);
        (0, helper_1.drawLine)(overlayHost.ctx, _lastPoint, point, 1 * dpr / scale);
        _lastPoint = point;
    },
    mouseUp: function () {
        const { interaction, cursor, action, overlayHost } = this.editor;
        const { center, points, closed } = (0, helper_1.convertDrawPointsToBezierPoints)(_drawingPoints);
        const eleProps = {
            type: 'path',
            cx: center.x,
            cy: center.y,
            points,
            closed,
            //
            /*      fill:{
                    enabled:true,
                    color:'blue'
                  }*/
        };
        cursor.unlock();
        overlayHost.unlock();
        action.dispatch('element-add', [eleProps]);
        _drawingPoints.length = 0;
        _lastPoint = null;
        interaction._ele = null;
        // action.dispatch('clear-creation')
    },
};
exports.default = pencilTool;
