const panning = {
    start() {
        this.editor.cursor.set('grabbing');
        // updateCursor.call(this, 'grabbing')
    },
    move(e) {
        this.editor.container.setPointerCapture(e.pointerId);
        this.editor.action.dispatch('world-shift', {
            x: e.movementX,
            y: e.movementY,
        });
    },
    finish() {
        this.editor.cursor.set('grab');
    },
};
export default panning;
