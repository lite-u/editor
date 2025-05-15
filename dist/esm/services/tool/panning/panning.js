const panning = {
    cursor: 'grab',
    mouseDown() {
        this.editor.cursor.set('grabbing');
        // updateCursor.call(this, 'grabbing')
    },
    mouseMove() {
        // this.editor.container.setPointerCapture(e.pointerId)
        const { _modifier } = this.editor.interaction;
        this.editor.action.dispatch('world-shift', {
            x: _modifier.movementX,
            y: _modifier.movementY,
        });
    },
    mouseUp() {
        this.editor.cursor.set('grab');
    },
};
export default panning;
