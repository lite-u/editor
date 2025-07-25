import Editor from '../editor.ts';
import DoublyLinkedList, { HistoryNode } from './DoublyLinkedList.ts';
import { HistoryOperation } from './type';
declare class History extends DoublyLinkedList {
    private editor;
    constructor(editor: Editor);
    init(): void;
    add(data: HistoryOperation): void;
    toArray(): HistoryNode[];
    compareToCurrentPosition(node: HistoryNode): false | "front" | "equal" | "behind";
    forward(): HistoryNode | false;
    back(): HistoryNode | false;
}
export default History;
