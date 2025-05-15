import nid from '~/core/nid';
import resizeTool from '~/services/tool/resize/resizeTool';
const lineSegmentTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { elementManager, interaction, action, selection } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const width = 1;
        const height = 1;
        const id = 'rectangle-' + nid();
        const eleProps = {
            type: 'lineSegment',
            cx: x - width / 2,
            cy: y - height / 2,
            width,
            height,
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
