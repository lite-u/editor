import resizeFunc from './resize/resizeFunc.js';
const lineSegmentTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { mainHost, interaction, world } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        let initialLineLen = 1;
        const cx = x + initialLineLen / 2;
        const cy = y + initialLineLen / 2;
        // const startPoint = {x, y}
        // const endPoint = {x: x + initialLineLen, y: y + initialLineLen}
        const eleProps = {
            type: 'lineSegment',
            cx,
            cy,
            points: [
                { id: 'start', x: x - cx, y: y - cy },
                { id: 'end', x: x - cx + initialLineLen, y: y - cy + initialLineLen },
            ],
        };
        const ele = mainHost.create(eleProps);
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
export default lineSegmentTool;
