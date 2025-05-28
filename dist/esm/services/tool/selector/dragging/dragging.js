const dragging = {
    cursor: 'drag',
    mouseMove: function () {
        const { interaction, action, cursor } = this.editor;
        const dp = interaction.mouseWorldMovement;
        console.log('drag');
        // interaction.selectedOutlineElement?.translate(dp.x, dp.y, false)
        cursor.set(dragging.cursor);
        cursor.lock();
        // const start = performance.now();
        interaction._draggingElements.forEach(ele => ele.translate(dp.x, dp.y, false));
        // const end = performance.now();
        // console.log(`Canvas render took ${end - start}ms`);
        // this.overlayHost.reset()
        action.dispatch('element-updated');
    },
    mouseUp() {
        const { interaction, action, cursor } = this.editor;
        // this.action.dispatch('rerender-overlay')
        cursor.unlock();
        // this.action.dispatch('rerender-main-host')
        interaction._draggingElements = [];
        action.dispatch('element-move', { delta: { x: 0, y: 0 } });
        // this.action.dispatch('refresh-overlay')
    },
};
export default dragging;
