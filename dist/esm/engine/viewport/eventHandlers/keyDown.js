import { applyResize } from './funcs.js';
import { updateCursor } from '../domManipulations.js';
// import {updateSelectionBox} from "../domManipulations.js"
function handleKeyDown(e) {
    // const _t = e.target !== this.wrapper
    if (this.manipulationStatus === 'panning' || this.manipulationStatus === 'selecting')
        return;
    if (e.code === 'Space') {
        this.viewport.spaceKeyDown = true;
        updateCursor.call(this, 'grabbing');
        // this.viewport.wrapper.style.cursor = 'grabbing'
        e.preventDefault();
        return;
    }
    if (this.manipulationStatus === 'resizing') {
        const { altKey, shiftKey } = e;
        const r = applyResize.call(this, altKey, shiftKey);
        this.action.dispatch('module-modifying', {
            type: 'resize',
            data: r,
        });
    }
}
export default handleKeyDown;
