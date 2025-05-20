let _mouseMoved = false;
const dragging = {
    cursor: 'drag',
    mouseMove() {
        _mouseMoved = true;
        const { movementX, movementY } = this.editor.interaction._modifier;
        const { dpr, scale } = this.editor.world;
        const ratio = dpr * scale;
        const dp3 = { x: movementX / ratio, y: movementY / ratio };
        this.editor.action.dispatch('element-moving', { delta: { ...dp3 } });
    },
    mouseUp() {
    },
};
export default dragging;
