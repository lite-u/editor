let _mouseMoved = false;
const dragging = {
    cursor: 'drag',
    mouseMove() {
        _mouseMoved = true;
        const { movementX, movementY } = this.editor.interaction._modifier;
        const { dpr, scale } = this.editor.world;
        const ratio = dpr * scale;
        const dp2 = { x: movementX / scale, y: movementY / scale };
        const dp3 = { x: movementX * dpr / scale, y: movementY * dpr / scale };
        console.log(ratio, dp2);
        this.editor.action.dispatch('element-moving', { delta: { ...dp3 } });
    },
    mouseUp() {
        this.editor.action.dispatch('element-move', { delta: { x: 0, y: 0 } });
    },
};
export default dragging;
