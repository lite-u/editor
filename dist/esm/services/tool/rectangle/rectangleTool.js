import resizeFunc from '../resize/resizeFunc.js';
const rectangleTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { mainHost, interaction, world } = this;
        const { x, y } = this.interaction.mouseWorldCurrent;
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
        if (!this.interaction._ele)
            return;
        this.action.dispatch('clear-creation');
        resizeFunc.call(this, [this.interaction._ele], 'br');
        this.interaction._ele.render(this.world.creationCanvasContext);
    },
    mouseUp() {
        const eleProps = this.interaction._ele.toMinimalJSON();
        console.log(eleProps);
        this.action.dispatch('element-add', [eleProps]);
        this.interaction._ele = null;
    },
};
export default rectangleTool;
