import DoublyLinkedList from './DoublyLinkedList';
class History extends DoublyLinkedList {
    constructor(editor) {
        super();
        this.editor = editor;
        this.init();
    }
    init() {
        this.append({
            type: 'history-init',
            payload: {
                state: null,
                selectedModules: new Set(),
            },
        });
        this.editor.events.onHistoryUpdated?.(this);
    }
    // Add a History node after the current
    add(data) {
        this.detach();
        this.append(data);
    }
    toArray() {
        const list = [];
        if (this.head) {
            let curr = this.head;
            list.push(curr);
            while (curr.next) {
                list.push(curr.next);
                curr = curr.next;
            }
        }
        return list;
    }
    compareToCurrentPosition(node) {
        return super.compareToCurrentPosition(node);
    }
    forward() {
        return super.forward();
    }
    back() {
        return super.back();
    }
}
export default History;
//# sourceMappingURL=history.js.map