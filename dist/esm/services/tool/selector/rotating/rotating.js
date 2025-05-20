import resizeFunc from '../../resize/resizeFunc.js';
const rotating = {
    // cursor: 'default',
    mouseMove() {
        console.log(222);
        const { interaction, elementManager, action, selection, cursor } = this.editor;
        resizeFunc.call(this, elementManager.getElementsByIdSet(selection.values), interaction._resizingData.placement);
        this.editor.action.dispatch('element-updated');
        // this.subTool.mouseMove.call(this)
    },
    mouseUp() {
        if (!this.subTool)
            return;
        // this.subTool.mouseUp.call(this)
        this.subTool = null;
    },
};
export default rotating;
