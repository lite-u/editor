import selecting from '~/services/tool/selector/selecting/selecting';
import dragging from '~/services/tool/selector/dragging/dragging';
import resizing from '~/services/tool/selector/resizing/resizing';
const selector = {
    cursor: 'default',
    mouseDown: function () {
        const { interaction, elementManager, action, selection, cursor } = this.editor;
        const { _hoveredElement, mouseStart, mouseCurrent, _modifier: { shiftKey, metaKey, ctrlKey } } = interaction;
        const dragMode = !!_hoveredElement;
        const rotateMode = !!interaction._hoveredRotateManipulator;
        const resizeMode = !!interaction._hoveredResizeManipulator;
        if (resizeMode) {
            const placement = interaction._hoveredResizeManipulator.id.replace('handle-resize-', '');
            console.log(9);
            cursor.set('resize');
            interaction._resizingData = { placement };
            return;
        }
        // interaction._snappedPoint = null
        if (dragMode) {
            this.subTool = dragging;
            const id = _hoveredElement.id;
            if (!this.editor.selection.has(id)) {
                action.dispatch('selection-modify', { mode: 'replace', idSet: new Set([_hoveredElement.id]) });
            }
            interaction._draggingElements = elementManager.getElementsByIdSet(selection.values);
        }
        else if (rotateMode) {
            // this.tool = resizeTool
        }
        else if (resizeMode) {
            // this.tool = resize
            this.subTool = resizing;
        }
        else {
            this.subTool = selecting;
            return;
        }
    },
    mouseMove() {
        const { interaction, cursor } = this.editor;
        if (interaction._hoveredResizeManipulator) {
            // const placement = interaction._hoveredResizeManipulator.id.replace('handle-resize-', '')
            cursor.set('nw-resize');
            console.log(10);
            // interaction._resizingElements = elementManager.getElementsByIdSet(selection.values)
            return;
        }
        // if (!this.subTool) return
        this.subTool?.mouseMove.call(this);
    },
    mouseUp() {
        if (!this.subTool)
            return;
        this.subTool.mouseUp.call(this);
        this.subTool = null;
    },
};
export default selector;
