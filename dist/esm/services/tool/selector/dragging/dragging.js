const dragging = {
    cursor: 'drag',
    mouseMove: function () {
        const { interaction } = this;
        const dp = interaction.mouseWorldMovement;
        interaction.selectedOutlineElement?.translate(dp.x, dp.y, false);
        interaction._draggingElements.forEach(ele => ele.translate(dp.x, dp.y, false));
        this.action.dispatch('render-overlay');
        this.action.dispatch('render-main-host');
    },
    mouseUp() {
        this.interaction._draggingElements = [];
        this.action.dispatch('element-move', { delta: { x: 0, y: 0 } });
    },
};
export default dragging;
