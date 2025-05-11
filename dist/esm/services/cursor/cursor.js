class Cursor {
    domRef;
    editor;
    constructor(editor) {
        this.editor = editor;
        this.domRef = document.createElement('div');
    }
    set(cursor) {
        console.log('set cursor', cursor);
    }
    grab() { }
    grabbing() { }
    default() { }
    destroy() {
        this.domRef.remove();
        this.domRef = null;
    }
}
export default Cursor;
