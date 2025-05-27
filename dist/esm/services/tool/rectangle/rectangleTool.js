import ElementRectangle from '../../../elements/rectangle/rectangle.js';
import resizeFunc from '../resize/resizeFunc.js';
const rectangleTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { interaction, world } = this.editor;
        const { x, y } = interaction.mouseWorldCurrent;
        const width = 1;
        const height = 1;
        const cx = x - width / 2;
        const cy = y - height / 2;
        const ele = ElementRectangle.create('rectangle-creating', cx, cy, width, height);
        ele.render(world.creationCanvasContext);
        interaction._ele = ele;
    },
    mouseMove() {
        const { action, interaction, world } = this.editor;
        if (!interaction._ele)
            return;
        action.dispatch('clear-creation');
        resizeFunc.call(this, [interaction._ele], 'br');
        interaction._ele.render(world.creationCanvasContext);
    },
    mouseUp() {
        const { action, interaction } = this.editor;
        const eleProps = interaction._ele.toMinimalJSON();
        action.dispatch('element-add', [eleProps]);
        interaction._ele = null;
    },
};
export default rectangleTool;
