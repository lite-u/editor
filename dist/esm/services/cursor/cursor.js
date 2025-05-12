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
    move(p, rotation) {
        console.log('set cursor', p);
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
