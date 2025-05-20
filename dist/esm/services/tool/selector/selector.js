import selecting from './selecting/selecting.js';
import dragging from './dragging/dragging.js';
import resizing from './resizing/resizing.js';
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
            interaction._resizingData = { direction: placement };
        }
        // interaction._snappedPoint = null
        if (interaction._resizingData) {
            // interaction._resizingElements = elementManager.getElementsByIdSet(selection.values)
            return;
        }
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
        if (!this.subTool)
            return;
        this.subTool.mouseMove.call(this);
    },
    mouseUp() {
        if (!this.subTool)
            return;
        this.subTool.mouseUp.call(this);
        this.subTool = null;
    },
};
export default selector;
