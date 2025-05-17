let _timer = null;
const zoomInTool = {
    cursor: 'zoom-in',
    mouseDown() {
    },
    mouseMove() { },
    mouseUp() {
        this.editor.action.dispatch('world-zoom', {});
    },
};
export default zoomInTool;
