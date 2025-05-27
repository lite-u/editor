import resizeFunc from './resize/resizeFunc.js';
const ellipseTool = {
    cursor: 'crosshair',
    mouseDown: function () {
        const { mainHost, interaction, world } = this.editor;
        const { x, y } = interaction.mouseWorldCurrent;
        const r1 = 1;
        const r2 = 1;
        const rectProps = {
            type: 'ellipse',
            cx: x - r1 / 2,
            cy: y - r2 / 2,
            r1,
            r2,
        };
        const ele = mainHost.create(rectProps);
        ele.render(world.creationCanvasContext);
        interaction._ele = ele;
    },
    mouseMove: function () {
        const { mainHost, action, interaction, world } = this.editor;
        if (!interaction._ele)
            return;
        action.dispatch('clear-creation');
        resizeFunc.call(this, [interaction._ele], 'br');
        interaction._ele.render(world.creationCanvasContext);
    },
    mouseUp: function () {
        const { mainHost, action, interaction, world } = this.editor;
        const eleProps = interaction._ele.toMinimalJSON();
        action.dispatch('element-add', [eleProps]);
        interaction._ele = null;
    },
};
export default ellipseTool;
