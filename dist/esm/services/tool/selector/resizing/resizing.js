import resizeElements from '../../resize/resizeElements.js';
const resizing = {
    // cursor: 'default',
    mouseMove() {
        const { interaction, mainHost, action, selection, cursor } = this.editor;
        if (!interaction._resizingData)
            return;
        cursor.lock();
        resizeElements.call(this, mainHost.getElementsByIdSet(selection.values), interaction._resizingData.placement);
        action.dispatch('element-updated');
    },
    mouseUp() {
        const { interaction, mainHost, action, selection, cursor } = this.editor;
        if (!interaction._resizingData)
            return;
        const changes = resizeElements.call(this, mainHost.getElementsByIdSet(selection.values), interaction._resizingData.placement);
        const elements = mainHost.getElementsByIdSet(selection.values);
        const replaceChanges = [];
        cursor.unlock();
        elements.forEach(ele => {
            if (ele._transforming) {
                console.log(ele._shadowPath);
                replaceChanges.push({ from: ele, to: ele._shadowPath });
            }
            else {
                ele.updateOriginal();
            }
        });
        interaction._resizingData = null;
        action.dispatch('element-modified', changes);
        action.dispatch('element-replace', replaceChanges);
        this.subTool = null;
    },
};
export default resizing;
