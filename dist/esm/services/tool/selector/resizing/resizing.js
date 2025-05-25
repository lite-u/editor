import resizeFunc from '../../resize/resizeFunc.js';
const resizing = {
    // cursor: 'default',
    mouseMove() {
        // console.log(111)
        // interaction._resizingElements = elementManager.getElementsByIdSet(selection.values)
        const { interaction, mainHost, action, selection, cursor } = this.editor;
        resizeFunc.call(this, mainHost.getElementsByIdSet(selection.values), interaction._resizingData.placement);
        this.editor.action.dispatch('element-updated');
        /*
            interaction._outlineElement?.rotateFrom(rotationDiff, targetPoint)
            interaction._manipulationElements.forEach(ele => {
              ele.rotateFrom(rotationDiff, targetPoint)
            })
            elements.forEach(ele => {
              ele.rotateFrom(rotationDiff, targetPoint)
            })
        
            this.editor.action.dispatch('render-overlay')
            this.editor.action.dispatch('render-main-host')*/
        // this.subTool.mouseMove.call(this)
    },
    mouseUp() {
        if (!this.subTool)
            return;
        // this.subTool.mouseUp.call(this)
        this.subTool = null;
    },
};
export default resizing;
