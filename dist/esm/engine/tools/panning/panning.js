import { updateCursor } from '../../viewport/domManipulations.js';
const panning = {
    start() {
        updateCursor.call(this, 'grabbing');
    },
    move(e) {
        this.viewport.wrapper.setPointerCapture(e.pointerId);
        this.action.dispatch('world-shift', {
            x: e.movementX,
            y: e.movementY,
        });
    },
    finish(e) {
    },
};
export default panning;
