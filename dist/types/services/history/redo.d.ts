import { HistoryNode } from './DoublyLinkedList';
import Editor from '../../engine/editor';
export declare function redo(this: Editor, quiet?: boolean): HistoryNode | false;
