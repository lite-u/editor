"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const funcs_ts_1 = require("./funcs.ts");
// import {updateSelectionBox} from "../domManipulations.ts"
function handleKeyUp(e) {
    if (e.code === 'Space') {
        this.viewport.spaceKeyDown = false;
        this.viewport.wrapper.style.cursor = 'default';
    }
    if (this.manipulationStatus === 'resizing') {
        const { altKey, shiftKey } = e;
        const r = funcs_ts_1.applyResize.call(this, altKey, shiftKey);
        this.action.dispatch('module-modifying', {
            type: 'resize',
            data: r,
        });
    }
}
exports.default = handleKeyUp;
