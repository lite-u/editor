import { HistoryNode } from './DoublyLinkedList';
import Editor from '../editor';
export declare function redo(this: Editor, quiet?: boolean): HistoryNode | false;
