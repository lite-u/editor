const dragging = {
    cursor: 'drag',
    mouseMove: function () {
        const { interaction, action, cursor } = this.editor;
        const dp = interaction.mouseWorldMovement;
        cursor.set(dragging.cursor);
        cursor.lock();
        interaction._draggingElements.forEach(ele => ele.translate(dp.x, dp.y, false));
        action.dispatch('element-updated');
    },
    mouseUp() {
        const { interaction, action, cursor } = this.editor;
        cursor.unlock();
        // this.action.dispatch('rerender-main-host')
        interaction._draggingElements = [];
        action.dispatch('element-move', { delta: { x: 0, y: 0 } });
        // this.action.dispatch('refresh-overlay')
    },
};
export default dragging;
