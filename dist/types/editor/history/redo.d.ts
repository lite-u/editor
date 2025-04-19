import { HistoryNode } from './DoublyLinkedList.ts';
import Editor from '../editor.ts';
export declare function redo(this: Editor, quiet?: boolean): HistoryNode | false;
