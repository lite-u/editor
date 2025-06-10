import resizeElements from './resize/resizeElements.js';
import ElementEllipse from '../../elements/ellipse/ellipse.js';
import { nid } from '../../index.js';
const ellipseTool = {
    cursor: 'crosshair',
    mouseDown: function () {
        const { cursor, action, overlayHost, interaction } = this.editor;
        const { x, y } = interaction.mouseWorldCurrent;
        const r1 = 1;
        const r2 = 1;
        const cx = x - r1 / 2;
        const cy = y - r2 / 2;
        const ele = ElementEllipse.create('rectangle-creating', cx, cy, r1, r2);
        cursor.lock();
        action.dispatch('rerender-overlay');
        ele.render(overlayHost.ctx);
        interaction._ele = ele;
    },
    mouseMove: function () {
        const { action, interaction, overlayHost } = this.editor;
        if (!interaction._ele)
            return;
        resizeElements.call(this, [interaction._ele], 'br');
        action.dispatch('rerender-overlay');
        interaction._ele.render(overlayHost.ctx);
    },
    mouseUp: function () {
        const { cursor, action, interaction } = this.editor;
        const eleProps = interaction._ele.toMinimalJSON();
        eleProps.id = nid();
        cursor.unlock();
        action.dispatch('element-add', [eleProps]);
        interaction._ele = null;
    },
};
export default ellipseTool;
