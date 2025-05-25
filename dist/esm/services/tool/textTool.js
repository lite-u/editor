import resizeFunc from './resize/resizeFunc.js';
import { DEFAULT_FONT, DEFAULT_STROKE, DEFAULT_TEXT_FILL } from '../../elements/defaultProps.js';
const textTool = {
    cursor: 'text',
    mouseDown: function () {
        const { mainHost, interaction, world } = this;
        const { x, y } = this.interaction.mouseWorldCurrent;
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
        const ele = mainHost.create(eleProps);
        if (ele) {
            ele.render(world.creationCanvasContext);
            interaction._ele = ele;
        }
    },
    mouseMove: function () {
        if (!this.interaction._ele)
            return;
        this.action.dispatch('clear-creation');
        resizeFunc.call(this, [this.interaction._ele], 'br');
        this.interaction._ele.render(this.world.creationCanvasContext);
    },
    mouseUp: function () {
        const eleProps = this.interaction._ele.toMinimalJSON();
        this.action.dispatch('element-add', [eleProps]);
        this.interaction._ele = null;
    },
};
export default textTool;
