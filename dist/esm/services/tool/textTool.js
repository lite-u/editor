import resizeFunc from './resize/resizeFunc.js';
import { DEFAULT_FONT, DEFAULT_STROKE, DEFAULT_TEXT_FILL } from '../../elements/defaultProps.js';
const textTool = {
    cursor: 'text',
    mouseDown() {
        const { elementManager, interaction, world } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const width = 1;
        const height = 1;
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
        };
        const ele = elementManager.create(eleProps);
        ele.render(world.creationCanvasContext);
        interaction._ele = ele;
    },
    mouseMove() {
        if (!this.editor.interaction._ele)
            return;
        this.editor.action.dispatch('clear-creation');
        resizeFunc.call(this, [this.editor.interaction._ele], 'br');
        this.editor.interaction._ele.render(this.editor.world.creationCanvasContext);
    },
    mouseUp() {
        const eleProps = this.editor.interaction._ele.toMinimalJSON();
        this.editor.action.dispatch('element-add', [eleProps]);
        this.editor.interaction._ele = null;
    },
};
export default textTool;
