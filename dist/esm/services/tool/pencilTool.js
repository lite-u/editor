import nid from '~/core/nid';
const points = [];
const pencilTool = {
    cursor: 'crosshair',
    mouseDown() {
        const { creationCanvasContext: ctx } = this.editor.world;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        this.editor.action.dispatch('selection-clear');
        ctx.save();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 100;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 100, y + 100);
        ctx.stroke();
        ctx.restore();
    },
    mouseMove() {
        const { overlayCanvasContext: ctx } = this.editor.world;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        this.editor.action.dispatch('selection-clear');
        ctx.save();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 100;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 100, y + 100);
        ctx.stroke();
        ctx.restore();
    },
    mouseUp() {
        const { elementManager, interaction, action, selection } = this.editor;
        const { x, y } = this.editor.interaction.mouseWorldCurrent;
        const id = 'rectangle-' + nid();
        interaction._ele = null;
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
        // interaction._ele = ele
        action.dispatch('selection-clear');
    },
};
export default pencilTool;
