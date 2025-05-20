import resizeFunc from './resize/resizeFunc.js';
const lineSegmentTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { elementManager, interaction, world } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const eleProps = {
            type: 'lineSegment',
            points: [
                { id: 'start', x, y },
                { id: 'end', x: x + 1, y: y + 1 },
            ],
        };
        const ele = elementManager.create(eleProps);
        ele.render(world.creationCanvasContext);
        interaction._ele = ele;
    },
    mouseMove() {
        if (!this.editor.interaction._ele)
            return;
        this.editor.action.dispatch('clear-creation');
        resizeFunc.call(this, [this.editor.interaction._ele], 'br');
        this.editor.interaction._ele.render(this.editor.world.creationCanvasContext);
    },
    mouseUp() {
        const eleProps = this.editor.interaction._ele.toMinimalJSON();
        this.editor.action.dispatch('element-add', [eleProps]);
        this.editor.interaction._ele = null;
    },
};
export default lineSegmentTool;
