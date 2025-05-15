import nid from '../../core/nid.js';
import resizeTool from './resize/resizeTool.js';
const ellipseTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { elementManager, interaction, action, selection } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const r1 = 1;
        const r2 = 1;
        const id = 'ellipse-' + nid();
        const rectProps = {
            type: 'ellipse',
            cx: x - r1 / 2,
            cy: y - r2 / 2,
            r1,
            r2,
            id,
            layer: 0,
        };
        const ele = elementManager.add(elementManager.create(rectProps));
        // interaction.state = 'resizing'
        interaction._ele = ele;
        action.dispatch('selection-clear');
        selection.replace(new Set([ele.id]));
        action.dispatch('visible-element-updated');
    },
    mouseMove() {
        if (!this.editor.interaction._ele)
            return;
        resizeTool.call(this);
    },
    mouseUp() {
        this.editor.interaction._ele = null;
    },
};
export default ellipseTool;
