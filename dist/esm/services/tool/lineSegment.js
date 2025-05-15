import nid from '~/core/nid';
import { getRotateAngle } from '~/services/tool/selector/helper';
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
        const { points: { start, end } } = this.editor.interaction._ele;
        end.x = interaction.mouseWorldDelta.x;
        end.y = interaction.mouseWorldDelta.y;
        console.log(getRotateAngle(start, end));
        this.editor.action.dispatch('visible-element-updated');
    },
    mouseUp() {
        this.editor.interaction._ele = null;
    },
};
export default lineSegmentTool;
