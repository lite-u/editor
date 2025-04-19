import { HistoryNode } from './DoublyLinkedList.ts';
import Editor from '../editor.ts';
export declare function undo(this: Editor, quiet?: boolean): HistoryNode | false;
