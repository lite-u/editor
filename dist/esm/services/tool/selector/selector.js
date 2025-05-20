import selecting from './selecting/selecting.js';
import dragging from './dragging/dragging.js';
import resizing from './resizing/resizing.js';
import rotating from './rotating/rotating.js';
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
            this.subTool = resizing;
            interaction._resizingData = { placement };
            return;
        }
        else if (rotateMode) {
            interaction._rotateData = { startRotation: 0 };
            this.subTool = rotating;
        }
        else if (dragMode) {
            this.subTool = dragging;
            const id = _hoveredElement.id;
            if (!this.editor.selection.has(id)) {
                action.dispatch('selection-modify', { mode: 'replace', idSet: new Set([_hoveredElement.id]) });
            }
            interaction._draggingElements = elementManager.getElementsByIdSet(selection.values);
        }
        else {
            this.subTool = selecting;
            return;
        }
    },
    mouseMove() {
        const { interaction, cursor } = this.editor;
        if (interaction._hoveredResizeManipulator) {
            cursor.set('nw-resize');
            // console.log(10)
        }
        else if (interaction._hoveredRotateManipulator) {
            cursor.set('rotate');
            // console.log(10)
        }
        else {
            cursor.set(selector.cursor);
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
