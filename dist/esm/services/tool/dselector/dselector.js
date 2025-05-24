const dSelector = {
    cursor: 'default',
    mouseDown: function () {
        this.interaction._movingHandle = this.interaction._hoveredHandle;
    },
    mouseMove: function () {
        if (!this.interaction._movingHandle)
            return;
        const { interaction } = this;
        // this.container.setPointerCapture(e.pointerId)
        const { x, y } = interaction.mouseWorldMovement;
        this.interaction._movingHandle.translate(x, y);
    },
    mouseUp: function () {
        this.interaction._movingHandle = null;
        // this.editor.cursor.set('grab')
    },
};
export default dSelector;
