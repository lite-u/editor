const zoomOutTool = {
    cursor: 'zoom-out',
    mouseDown() {
        this.editor.cursor.set('grabbing');
        // updateCursor.call(this, 'grabbing')
    },
    mouseMove() { },
    mouseUp() {
        this.editor.cursor.set('grab');
    },
};
export default zoomOutTool;
