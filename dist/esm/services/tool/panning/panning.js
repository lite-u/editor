const panning = {
    cursor: 'grab',
    mouseDown() {
        this.editor.cursor.set('grabbing');
        // updateCursor.call(this, 'grabbing')
    },
    mouseMove(e) {
        // this.editor.container.setPointerCapture(e.pointerId)
        this.editor.action.dispatch('world-shift', {
            x: e.movementX,
            y: e.movementY,
        });
    },
    mouseUp() {
        this.editor.cursor.set('grab');
    },
};
export default panning;
