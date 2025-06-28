"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rectangle_1 = __importDefault(require("~/elements/rectangle/rectangle"));
const resizeElements_1 = __importDefault(require("~/services/tool/resize/resizeElements"));
const index_1 = require("~/index");
const rectangleTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { action, cursor, overlayHost, interaction } = this.editor;
        const { x, y } = interaction.mouseWorldCurrent;
        const width = 1;
        const height = 1;
        const cx = x - width / 2;
        const cy = y - height / 2;
        const ele = rectangle_1.default.create('rectangle-creating', cx, cy, width, height);
        cursor.lock();
        action.dispatch('rerender-overlay');
        ele.render(overlayHost.ctx);
        interaction._ele = ele;
    },
    mouseMove() {
        const { action, interaction, overlayHost } = this.editor;
        if (!interaction._ele)
            return;
        resizeElements_1.default.call(this, [interaction._ele], 'br');
        action.dispatch('rerender-overlay');
        interaction._ele.render(overlayHost.ctx);
    },
    mouseUp() {
        const { cursor, action, interaction } = this.editor;
        const eleProps = interaction._ele.toMinimalJSON();
        eleProps.id = (0, index_1.nid)();
        cursor.unlock();
        action.dispatch('element-add', [eleProps]);
        interaction._ele = null;
    },
};
exports.default = rectangleTool;
