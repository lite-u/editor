import resizeFunc from '../../resize/resizeFunc.js';
const resizing = {
    // cursor: 'default',
    mouseMove() {
        const { interaction, mainHost, action, selection, cursor } = this.editor;
        if (!interaction._resizingData)
            return;
        cursor.lock();
        resizeFunc.call(this, mainHost.getElementsByIdSet(selection.values), interaction._resizingData.placement);
        action.dispatch('element-updated');
        /*
            interaction._outlineElement?.rotateFrom(rotationDiff, targetPoint)
            interaction._manipulationElements.forEach(ele => {
              ele.rotateFrom(rotationDiff, targetPoint)
            })
            elements.forEach(ele => {
              ele.rotateFrom(rotationDiff, targetPoint)
            })
    
            this.action.dispatch('render-overlay')
            this.action.dispatch('render-main-host')*/
        // this.subTool.mouseMove.call(this)
    },
    mouseUp() {
        if (!this.subTool)
            return;
        const { interaction, mainHost, action, selection, cursor } = this.editor;
        cursor.unlock();
        const changes = resizeFunc.call(this, mainHost.getElementsByIdSet(selection.values), interaction._resizingData.placement);
        const elements = mainHost.getElementsByIdSet(selection.values);
        // const changes: HistoryChangeItem[] = []
        // const rotation = resizing.mouseMove.call(this)
        elements.forEach(ele => {
            // const change = ele.rotateFrom(rotation, interaction._rotateData?.targetPoint, true)
            ele.updateOriginal();
            // changes.push(change)
        });
        // cursor.set(selector.cursor)
        interaction._resizingData = null;
        action.dispatch('element-modified', changes);
        this.subTool = null;
    },
};
export default resizing;
