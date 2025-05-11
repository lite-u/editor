import { HistoryNode } from './DoublyLinkedList';
import Editor from '../../engine/editor';
export declare function undo(this: Editor, quiet?: boolean): HistoryNode | false;
