const dragging = {
    cursor: 'drag',
    mouseMove: function () {
        const { interaction, elementManager, selection } = this;
        const dp = interaction.mouseWorldMovement;
        const elements = elementManager.getElementsByIdSet(selection.values);
        interaction._outlineElement?.translate(dp.x, dp.y);
        interaction._manipulationElements.forEach(ele => ele.translate(dp.x, dp.y));
        elements.forEach(ele => ele.translate(dp.x, dp.y));
        this.action.dispatch('render-overlay');
        this.action.dispatch('render-elements');
    },
    mouseUp() {
        this.interaction._draggingElements = [];
        this.action.dispatch('element-move', { delta: { x: 0, y: 0 } });
    },
};
export default dragging;
