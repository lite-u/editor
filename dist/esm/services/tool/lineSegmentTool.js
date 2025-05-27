import resizeFunc from './resize/resizeFunc.js';
import ElementLineSegment from '../../elements/lines/lineSegment.js';
const lineSegmentTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { mainHost, interaction, world } = this.editor;
        const { x, y } = interaction.mouseWorldCurrent;
        let lineLen = 1;
        const cx = x + lineLen / 2;
        const cy = y + lineLen / 2;
        // const startPoint = {x, y}
        // const endPoint = {x: x + initialLineLen, y: y + initialLineLen}
        /* const eleProps: PropsWithoutIdentifiers<'lineSegment'> = {
           type: 'lineSegment',
           cx,
           cy,
           points: [
             {id: 'start', x: x - cx, y: y - cy},
             {id: 'end', x: x - cx + lineLen, y: y - cy + lineLen},
           ],
         }
     */
        const ele = ElementLineSegment.create('lineSegment-creating', x - cx, y - cy, x - cx + lineLen, y - cy + lineLen);
        // const ele: ElementRectangle = mainHost.create(eleProps)
        ele.render(world.creationCanvasContext);
        interaction._ele = ele;
    },
    mouseMove() {
        const { action, interaction, world } = this.editor;
        if (!interaction._ele)
            return;
        action.dispatch('clear-creation');
        resizeFunc.call(this, [interaction._ele], 'br');
        interaction._ele.render(world.creationCanvasContext);
    },
    mouseUp() {
        const { action, interaction } = this.editor;
        const eleProps = interaction._ele.toMinimalJSON();
        action.dispatch('element-add', [eleProps]);
        interaction._ele = null;
    },
};
export default lineSegmentTool;
