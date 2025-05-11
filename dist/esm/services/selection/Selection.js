import { modifySelected } from './helper.js';
class Selection {
    selected = new Set();
    editor;
    constructor(editor) {
        this.editor = editor;
    }
    has(id) {
        return this.selected.has(id);
    }
    get size() {
        return this.selected.size;
    }
    get values() {
        return new Set(this.selected);
    }
    get pickIfUnique() {
        if (this.selected.size === 1) {
            const unique = [...this.selected.values()][0];
            const module = this.editor.elementManager.all.get(unique);
            if (module) {
                return module.toMinimalJSON();
            }
            return null;
        }
        return null;
    }
    selectAll() {
        this.selected = this.editor.elementManager.keys;
    }
    modify(idSet, action) {
        modifySelected.call(this, idSet, action);
    }
    add(idSet) {
        modifySelected.call(this, idSet, 'add');
    }
    delete(idSet) {
        modifySelected.call(this, idSet, 'delete');
    }
    toggle(idSet) {
        modifySelected.call(this, idSet, 'toggle');
    }
    replace(idSet) {
        realSelectedModules.clear();
    }
    destroy() {
        this.selected.clear();
    }
}
export default Selection;
