"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resizeElements_1 = __importDefault(require("~/services/tool/resize/resizeElements"));
const ellipse_1 = __importDefault(require("~/elements/ellipse/ellipse"));
const index_1 = require("~/index");
const ellipseTool = {
    cursor: 'crosshair',
    mouseDown: function () {
        const { cursor, action, overlayHost, interaction } = this.editor;
        const { x, y } = interaction.mouseWorldCurrent;
        const r1 = 1;
        const r2 = 1;
        const cx = x - r1 / 2;
        const cy = y - r2 / 2;
        const ele = ellipse_1.default.create('rectangle-creating', cx, cy, r1, r2);
        cursor.lock();
        action.dispatch('rerender-overlay');
        ele.render(overlayHost.ctx);
        interaction._ele = ele;
    },
    mouseMove: function () {
        const { action, interaction, overlayHost } = this.editor;
        if (!interaction._ele)
            return;
        resizeElements_1.default.call(this, [interaction._ele], 'br');
        action.dispatch('rerender-overlay');
        interaction._ele.render(overlayHost.ctx);
    },
    mouseUp: function () {
        const { cursor, action, interaction } = this.editor;
        const eleProps = interaction._ele.toMinimalJSON();
        eleProps.id = (0, index_1.nid)();
        cursor.unlock();
        action.dispatch('element-add', [eleProps]);
        interaction._ele = null;
    },
};
exports.default = ellipseTool;
