const panning = {
    cursor: 'grab',
    mouseDown() {
        this.editor.cursor.set('grabbing');
        // updateCursor.call(this, 'grabbing')
    },
    mouseMove() {
        // this.editor.container.setPointerCapture(e.pointerId)
        const { _modifier, mouseStart, mouseCurrent } = this.editor.interaction;
        this.editor.action.dispatch('world-shift', {
            x: mouseCurrent.x - mouseStart.x,
            y: mouseCurrent.y - mouseStart.y,
        });
    },
    mouseUp() {
        this.editor.cursor.set('grab');
    },
};
export default panning;
