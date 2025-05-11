import { modifySelected } from './helper.js';
class Selection {
    selectedElementIDSet = new Set();
    editor;
    constructor(editor) {
        this.editor = editor;
    }
    get getSelected() {
        return new Set(this.selectedElementIDSet);
    }
    get getSelectedPropsIfUnique() {
        if (this.selectedElementIDSet.size === 1) {
            const unique = [...this.selectedElementIDSet.values()][0];
            const module = this.editor.elementManager.all.get(unique);
            if (module) {
                return module.toMinimalJSON();
            }
            return null;
        }
        return null;
    }
    selectAll() {
        this.selectedElementIDSet = this.editor.elementManager.keys;
    }
    modifySelected(idSet, action) {
        modifySelected.call(this, idSet, action);
    }
    addSelected(idSet) {
        modifySelected.call(this, idSet, 'add');
    }
    deleteSelected(idSet) {
        modifySelected.call(this, idSet, 'delete');
    }
    toggleSelected(idSet) {
        modifySelected.call(this, idSet, 'toggle');
    }
    replaceSelected(idSet) {
        modifySelected.call(this, idSet, 'replace');
    }
    destroy() {
        this.selectedElementIDSet.clear();
    }
}
export default Selection;
