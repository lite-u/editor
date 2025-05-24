import resizeFunc from './resize/resizeFunc.js';
const ellipseTool = {
    cursor: 'crosshair',
    mouseDown: function () {
        const { elementManager, interaction, world } = this;
        const { x, y } = this.interaction.mouseWorldCurrent;
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
    mouseMove: function () {
        if (!this.interaction._ele)
            return;
        this.action.dispatch('clear-creation');
        resizeFunc.call(this, [this.interaction._ele], 'br');
        this.interaction._ele.render(this.world.creationCanvasContext);
    },
    mouseUp: function () {
        const eleProps = this.interaction._ele.toMinimalJSON();
        this.action.dispatch('element-add', [eleProps]);
        this.interaction._ele = null;
    },
};
export default ellipseTool;
