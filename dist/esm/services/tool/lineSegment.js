import nid from '../../core/nid.js';
import resizeTool from './resize/resizeTool.js';
const lineSegmentTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { elementManager, interaction, action, selection } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const id = 'rectangle-' + nid();
        const p1Props = { x, y };
        const p2Props = { x, y };
        const eleProps = {
            type: 'lineSegment',
            points: [p1Props, p2Props],
            id,
            layer: 0,
        };
        const ele = elementManager.add(elementManager.create(eleProps));
        interaction._ele = ele;
        action.dispatch('selection-clear');
        selection.replace(new Set([ele.id]));
    },
    mouseMove() {
        if (!this.editor.interaction._ele)
            return;
        this.editor.action.dispatch('visible-element-updated');
        resizeTool.call(this, [this.editor.interaction._ele], 'br');
    },
    mouseUp() {
        this.editor.interaction._ele = null;
    },
};
export default lineSegmentTool;
