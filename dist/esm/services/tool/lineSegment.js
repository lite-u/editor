import nid from '../../core/nid.js';
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
            points: { start: p1Props, end: p2Props },
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
        const { interaction } = this.editor;
        const line = this.editor.interaction._ele;
        line.points.end.x = interaction.mouseWorldDelta.x;
        line.points.end.y = interaction.mouseWorldDelta.y;
        this.editor.action.dispatch('visible-element-updated');
    },
    mouseUp() {
        this.editor.interaction._ele = null;
    },
};
export default lineSegmentTool;
