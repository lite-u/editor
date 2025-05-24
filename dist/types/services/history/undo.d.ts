import { HistoryNode } from './DoublyLinkedList';
import Editor from '../../main/editor';
export declare function undo(this: Editor, quiet?: boolean): HistoryNode | false;
