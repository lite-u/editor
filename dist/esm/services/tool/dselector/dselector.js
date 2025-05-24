const dSelector = {
    cursor: 'default',
    mouseDown() {
        this.editor.interaction._movingHandle = this.editor.interaction._hoveredHandle;
    },
    mouseMove() {
        if (!this.editor.interaction._movingHandle)
            return;
        const { interaction, elementManager, selection } = this.editor;
        // this.editor.container.setPointerCapture(e.pointerId)
        const { x, y } = interaction.mouseWorldMovement;
        this.editor.interaction._movingHandle.translate(x, y);
    },
    mouseUp() {
        this.editor.interaction._movingHandle = null;
        // this.editor.cursor.set('grab')
    },
};
export default dSelector;
