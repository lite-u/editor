"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resizeElements_1 = __importDefault(require("~/services/tool/resize/resizeElements"));
const defaultProps_1 = require("~/elements/defaultProps");
const textTool = {
    cursor: 'text',
    mouseDown: function () {
        const { mainHost, interaction, world } = this.editor;
        const { x, y } = interaction.mouseWorldCurrent;
        const width = 1;
        const height = 1;
        const eleProps = {
            type: 'text',
            content: [{
                    text: 'hello',
                    font: Object.assign({}, defaultProps_1.DEFAULT_FONT),
                    fill: Object.assign({}, defaultProps_1.DEFAULT_TEXT_FILL),
                    stroke: Object.assign({}, defaultProps_1.DEFAULT_STROKE),
                }],
            cx: x - width / 2,
            cy: y - height / 2,
            width,
            height,
        };
        const ele = mainHost.create(eleProps);
        if (ele) {
            ele.render(world.creationCanvasContext);
            interaction._ele = ele;
        }
    },
    mouseMove: function () {
        const { action, mainHost, interaction, world } = this.editor;
        if (!interaction._ele)
            return;
        action.dispatch('clear-creation');
        resizeElements_1.default.call(this, [interaction._ele], 'br');
        interaction._ele.render(world.creationCanvasContext);
    },
    mouseUp: function () {
        const { action, mainHost, interaction, world } = this.editor;
        const eleProps = interaction._ele.toMinimalJSON();
        action.dispatch('element-add', [eleProps]);
        interaction._ele = null;
    },
};
exports.default = textTool;
