import selecting from '~/services/tool/selector/selecting/selecting';
import dragTool from '~/services/tool/drag/dragTool';
import resizing from '~/services/tool/selector/resizing/resizing';
const selector = {
    cursor: 'default',
    mouseDown: function () {
        const { interaction, action, selection, cursor } = this.editor;
        const { _hoveredElement, mouseStart, mouseCurrent, _modifier: { shiftKey, metaKey, ctrlKey } } = interaction;
        const dragMode = !!_hoveredElement;
        const rotateMode = false;
        const resizeMode = false;
        if (dragMode) {
            this.subTool = dragTool;
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
