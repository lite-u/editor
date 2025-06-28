"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const funcs_ts_1 = require("./funcs.ts");
const domManipulations_ts_1 = require("../domManipulations.ts");
// import {updateSelectionBox} from "../domManipulations.ts"
function handleKeyDown(e) {
    // const _t = e.target !== this.wrapper
    if (this.manipulationStatus === 'panning' || this.manipulationStatus === 'selecting')
        return;
    if (e.code === 'Space') {
        this.viewport.spaceKeyDown = true;
        domManipulations_ts_1.updateCursor.call(this, 'grabbing');
        // this.viewport.wrapper.style.cursor = 'grabbing'
        e.preventDefault();
        return;
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
exports.default = handleKeyDown;
