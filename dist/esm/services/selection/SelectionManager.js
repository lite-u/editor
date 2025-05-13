import { selectionHelper } from './selectionHelper.js';
class SelectionManager {
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
    clear() {
        this.selected.clear();
    }
    get pickIfUnique() {
        if (this.selected.size === 1) {
            const unique = [...this.selected.values()][0];
            const element = this.editor.elementManager.all.get(unique);
            if (element) {
                return element.toMinimalJSON();
            }
            return null;
        }
        return null;
    }
    selectAll() {
        this.selected = this.editor.elementManager.keys;
    }
    modify(idSet, action) {
        selectionHelper.call(this, idSet, action);
        switch (action) {
            case 'add':
                this.add(idSet);
                break;
            case 'delete':
                this.delete(idSet);
                break;
            case 'toggle':
                this.toggle(idSet);
                break;
            case 'replace':
                this.replace(idSet);
                break;
        }
    }
    add(idSet) {
        idSet.forEach(id => {
            this.selected.add(id);
        });
    }
    delete(idSet) {
        idSet.forEach(id => {
            this.selected.delete(id);
        });
    }
    toggle(idSet) {
        idSet.forEach(id => {
            if (this.selected.has(id)) {
                this.selected.delete(id);
            }
            else {
                this.selected.add(id);
            }
        });
    }
    replace(idSet) {
        this.clear();
        this.selected = idSet;
    }
    destroy() {
        this.selected.clear();
    }
}
export default SelectionManager;
