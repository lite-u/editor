import resizeFunc from './resize/resizeFunc.js';
const ellipseTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { elementManager, interaction, world } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const r1 = 1;
        const r2 = 1;
        const rectProps = {
            type: 'ellipse',
            cx: x - r1 / 2,
            cy: y - r2 / 2,
            r1,
            r2,
        };
        const ele = elementManager.create(rectProps);
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
export default ellipseTool;
