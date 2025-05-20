let _mouseMoved = false;
const dragging = {
    cursor: 'drag',
    mouseMove() {
        _mouseMoved = true;
        const { movementX, movementY } = this.editor.interaction._modifier;
        const { dpr, scale } = this.editor.world;
        const dp = { x: movementX * dpr / scale, y: movementY * dpr / scale };
        this.editor.action.dispatch('element-moving', { delta: { ...dp } });
    },
    mouseUp() {
        this.editor.interaction._draggingElements = [];
        this.editor.action.dispatch('element-move', { delta: { x: 0, y: 0 } });
    },
};
export default dragging;
