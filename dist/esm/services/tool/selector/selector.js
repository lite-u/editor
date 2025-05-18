import selecting from './selecting/selecting.js';
import dragTool from '../drag/dragTool.js';
const selector = {
    cursor: 'default',
    mouseDown: function () {
        const { interaction, action, selection, cursor } = this.editor;
        const { _hoveredElement, mouseStart, mouseCurrent, _modifier: { shiftKey, metaKey, ctrlKey } } = interaction;
        const dragMode = !_hoveredElement;
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
        console.log(_hoveredElement);
        /* const rect = generateBoundingRectFromTwoPoints(
           mouseStart,
           mouseCurrent,
         )
    
         interaction.updateSelectionBox(rect)
    
         if (interaction._hoveredElement) {
           action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([interaction._hoveredElement.id])})
         }*/
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
