class Selection {
    selectedElementIDSet = new Set();
    editor;
    constructor(editor) {
        this.editor = editor;
    }
    get getSelected() {
        return new Set(this.selectedElementIDSet);
    }
    selectAll() {
        this.selectedElementIDSet = this.editor.elementManager.getAllIDSet();
    }
    destroy() {
        this.selectedElementIDSet.clear();
    }
}
export default Selection;
