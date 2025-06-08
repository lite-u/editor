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
    },
    mouseUp() {
        const { interaction, mainHost, action, selection, cursor } = this.editor;
        if (!interaction._resizingData)
            return;
        const changes = resizeFunc.call(this, mainHost.getElementsByIdSet(selection.values), interaction._resizingData.placement);
        const elements = mainHost.getElementsByIdSet(selection.values);
        cursor.unlock();
        elements.forEach(ele => {
            ele.updateOriginal();
        });
        // cursor.set(selector.cursor)
        interaction._resizingData = null;
        action.dispatch('element-modified', changes);
        this.subTool = null;
    },
};
export default resizing;
