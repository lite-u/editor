import { updateCursor } from '../../viewport/domManipulations.js';
const panning = {
    start() {
        this.cursor.set('grabbing');
        updateCursor.call(this, 'grabbing');
    },
    move(e) {
        this.viewport.wrapper.setPointerCapture(e.pointerId);
        this.action.dispatch('world-shift', {
            x: e.movementX,
            y: e.movementY,
        });
    },
    finish() {
        this.cursor.set('grab');
    },
};
export default panning;
