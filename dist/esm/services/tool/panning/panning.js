const panning = {
    cursor: 'grab',
    mouseDown() {
        this.editor.cursor.set('grabbing');
        // updateCursor.call(this, 'grabbing')
    },
    mouseMove() {
        // this.editor.container.setPointerCapture(e.pointerId)
        const { _modifier, _pointDown, mouseDelta, mouseStart, mouseCurrent } = this.editor.interaction;
        const { movementX, movementY } = _modifier;
        if (!_pointDown)
            return;
        this.editor.action.dispatch('world-shift', {
            x: movementX,
            y: movementY,
        });
    },
    mouseUp() {
        this.editor.cursor.set('grab');
    },
};
export default panning;
