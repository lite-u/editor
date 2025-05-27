import ElementRectangle from '../../../elements/rectangle/rectangle.js';
import resizeFunc from '../resize/resizeFunc.js';
const rectangleTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { action, cursor, overlayHost, interaction } = this.editor;
        const { x, y } = interaction.mouseWorldCurrent;
        const width = 1;
        const height = 1;
        const cx = x - width / 2;
        const cy = y - height / 2;
        const ele = ElementRectangle.create('rectangle-creating', cx, cy, width, height);
        cursor.lock();
        action.dispatch('rerender-overlay');
        ele.render(overlayHost.ctx);
        interaction._ele = ele;
    },
    mouseMove() {
        const { action, interaction, overlayHost } = this.editor;
        if (!interaction._ele)
            return;
        resizeFunc.call(this, [interaction._ele], 'br');
        action.dispatch('rerender-overlay');
        interaction._ele.render(overlayHost.ctx);
    },
    mouseUp() {
        const { cursor, action, interaction } = this.editor;
        const eleProps = interaction._ele.toMinimalJSON();
        cursor.unlock();
        action.dispatch('element-add', [eleProps]);
        interaction._ele = null;
    },
};
export default rectangleTool;
