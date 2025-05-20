import resizeFunc from './resizeFunc.js';
const resizeTool = {
    cursor: 'default',
    mouseMove() {
        console.log(9);
        // interaction._resizingElements = elementManager.getElementsByIdSet(selection.values)
        const { interaction, elementManager, action, selection, cursor } = this.editor;
        resizeFunc.call(this, elementManager.getElementsByIdSet(selection.values), interaction._resizingData.placement);
        // this.subTool.mouseMove.call(this)
    },
    mouseUp() {
        if (!this.subTool)
            return;
        // this.subTool.mouseUp.call(this)
        this.subTool = null;
    },
};
export default resizeTool;
