"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const snap_1 = __importDefault(require("~/services/tool/snap/snap"));
function handleMouseDown(e) {
    var _a, _b;
    // console.log(this)
    const { originalEvent } = e;
    const { button, shiftKey, metaKey, ctrlKey, altKey, clientX, clientY, movementX, movementY } = originalEvent;
    const modifiers = { shiftKey, metaKey, ctrlKey, altKey, button, movementX, movementY };
    const x = clientX - this.editor.rect.x;
    const y = clientY - this.editor.rect.y;
    const { interaction, world } = this.editor;
    interaction.mouseStart = { x, y };
    interaction.mouseCurrent = { x, y };
    interaction.mouseWorldStart = world.getWorldPointByViewportPoint(x, y);
    interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y);
    this.editor.interaction._modifier = modifiers;
    this.editor.interaction._pointDown = true;
    (_b = (_a = this.tool) === null || _a === void 0 ? void 0 : _a.mouseDown) === null || _b === void 0 ? void 0 : _b.call(this, e);
    // this.action.dispatch('clear-creation')
    snap_1.default.call(this);
}
exports.default = handleMouseDown;
