import selecting from './selecting/selecting.js';
import dragging from './dragging/dragging.js';
import resizing from './resizing/resizing.js';
const selector = {
    cursor: 'default',
    mouseDown: function () {
        const { interaction, action, selection, cursor } = this.editor;
        const { _hoveredElement, mouseStart, mouseCurrent, _modifier: { shiftKey, metaKey, ctrlKey } } = interaction;
        const dragMode = !!_hoveredElement;
        const rotateMode = false;
        const resizeMode = false;
        if (dragMode) {
            this.subTool = dragging;
            const id = _hoveredElement.id;
            if (!this.editor.selection.has(id)) {
                action.dispatch('selection-modify', { mode: 'replace', idSet: new Set([_hoveredElement.id]) });
            }
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
