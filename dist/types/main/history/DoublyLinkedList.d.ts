import { HistoryNext, HistoryOperation, HistoryPrev } from './type';
declare class HistoryNode {
    data: HistoryOperation;
    prev: HistoryPrev;
    next: HistoryNext;
    id: number;
    constructor(prev: HistoryPrev, next: HistoryNext, data: HistoryOperation, id?: number);
}
declare class DoublyLinkedList {
    head: HistoryNode | null;
    tail: HistoryNode | null;
    current: HistoryNode | null;
    constructor();
    /**
     * Detach: detach all nodes after current
     */
    protected detach(): HistoryNode | null;
    protected append(data: HistoryOperation): HistoryNode;
    protected back(): HistoryNode | false;
    protected forward(): HistoryNode | false;
    /**
     * 'front' : target node in front of current node
     * 'behind' : target node behind of current node
     * 'equal' : target node equal to current node
     * false : target node not belong to this linked list
     */
    protected compareToCurrentPosition(node: HistoryNode): 'front' | 'equal' | 'behind' | false;
    destroy(): void;
}
export { HistoryNode };
export default DoublyLinkedList;
