import resizeFunc from '../resize/resizeFunc.js';
const rectangleTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { mainHost, interaction, world } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const width = 1;
        const height = 1;
        const rectProps = {
            type: 'rectangle',
            cx: x - width / 2,
            cy: y - height / 2,
            width,
            height,
        };
        const ele = mainHost.create(rectProps);
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
        console.log(eleProps);
        this.editor.action.dispatch('element-add', [eleProps]);
        this.editor.interaction._ele = null;
    },
};
export default rectangleTool;
