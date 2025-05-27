import resizeFunc from './resize/resizeFunc.js';
const lineSegmentTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { mainHost, interaction, world } = this;
        const { x, y } = this.interaction.mouseWorldCurrent;
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
        if (!this.interaction._ele)
            return;
        this.action.dispatch('clear-creation');
        resizeFunc.call(this, [this.interaction._ele], 'br');
        this.interaction._ele.render(this.world.creationCanvasContext);
    },
    mouseUp() {
        const eleProps = this.interaction._ele.toMinimalJSON();
        this.action.dispatch('element-add', [eleProps]);
        this.interaction._ele = null;
    },
};
export default lineSegmentTool;
