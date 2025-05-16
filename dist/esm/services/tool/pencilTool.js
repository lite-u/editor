import nid from '../../core/nid.js';
import resizeTool from './resize/resizeTool.js';
const pencilTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { elementManager, interaction, action, selection } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const id = 'rectangle-' + nid();
        const eleProps = {
            id,
            layer: 0,
            type: 'lineSegment',
            points: [
                { id: 'start', x, y },
                { id: 'end', x: x + 1, y: y + 1 },
            ],
        };
        const ele = elementManager.add(elementManager.create(eleProps));
        interaction._ele = ele;
        action.dispatch('selection-clear');
        // selection.replace(new Set([ele.id]))
    },
    mouseMove() {
        if (!this.editor.interaction._ele)
            return;
        resizeTool.call(this, [this.editor.interaction._ele], 'br');
    },
    mouseUp() {
        this.editor.interaction._ele = null;
    },
};
export default pencilTool;
