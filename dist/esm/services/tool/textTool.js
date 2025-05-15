import nid from '../../core/nid.js';
import resizeTool from './resize/resizeTool.js';
import { DEFAULT_FONT, DEFAULT_STROKE, DEFAULT_TEXT_FILL } from '../../elements/defaultProps.js';
const textTool = {
    cursor: 'text',
    mouseDown() {
        const { elementManager, interaction, action, selection } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const width = 1;
        const height = 1;
        const id = 'rectangle-' + nid();
        const eleProps = {
            type: 'text',
            content: [{
                    text: 'hello',
                    font: { ...DEFAULT_FONT },
                    fill: { ...DEFAULT_TEXT_FILL },
                    stroke: { ...DEFAULT_STROKE },
                }],
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
        action.dispatch('visible-element-updated');
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
export default textTool;
