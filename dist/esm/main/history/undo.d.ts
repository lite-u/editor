import { HistoryNode } from './DoublyLinkedList';
import Editor from '../editor';
export declare function undo(this: Editor, quiet?: boolean): HistoryNode | false;
