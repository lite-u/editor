"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resizeElements_1 = __importDefault(require("~/services/tool/resize/resizeElements"));
const lineSegment_1 = __importDefault(require("~/elements/lines/lineSegment"));
const index_1 = require("~/index");
const lineSegmentTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { mainHost, action, cursor, overlayHost, interaction, world } = this.editor;
        const { x, y } = interaction.mouseWorldCurrent;
        let lineLen = 1;
        const ele = lineSegment_1.default.create('lineSegment-creating', x, y, x + lineLen, y + lineLen);
        cursor.lock();
        action.dispatch('rerender-overlay');
        ele.render(overlayHost.ctx);
        interaction._ele = ele;
    },
    mouseMove() {
        const { action, interaction, cursor, overlayHost, world } = this.editor;
        if (!interaction._ele)
            return;
        // action.dispatch('clear-creation')
        resizeElements_1.default.call(this, [interaction._ele], 'br');
        action.dispatch('rerender-overlay');
        interaction._ele.render(overlayHost.ctx);
    },
    mouseUp() {
        const { action, interaction, cursor } = this.editor;
        const eleProps = interaction._ele.toMinimalJSON();
        eleProps.id = (0, index_1.nid)();
        cursor.unlock();
        action.dispatch('element-add', [eleProps]);
        interaction._ele = null;
    },
};
exports.default = lineSegmentTool;
