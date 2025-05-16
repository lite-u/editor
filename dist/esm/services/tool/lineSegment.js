import nid from '../../core/nid.js';
import resizeTool from './resize/resizeTool.js';
const lineSegmentTool = {
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
                { id: 'end', x, y },
            ],
        };
        const ele = elementManager.add(elementManager.create(eleProps));
        interaction._ele = ele;
        action.dispatch('selection-clear');
        selection.replace(new Set([ele.id]));
    },
    mouseMove() {
        /*if (!this.editor.interaction._ele) return
        const {interaction} = this.editor
        const {points: {start, end}} = this.editor.interaction._ele as InstanceType<ElementLineSegment>
    
    
        end.x = interaction.mouseWorldDelta.x
        end.y = interaction.mouseWorldDelta.y
    
        console.log(getRotateAngle(start, end))
    
        this.editor.action.dispatch('visible-element-updated')*/
        if (!this.editor.interaction._ele)
            return;
        resizeTool.call(this, [this.editor.interaction._ele], 'br');
    },
    mouseUp() {
        this.editor.interaction._ele = null;
    },
};
export default lineSegmentTool;
