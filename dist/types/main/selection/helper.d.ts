import { SelectionActionMode } from './type';
import Editor from '../editor.ts';
export declare function modifySelected(this: Editor, idSet: Set<UID>, action: SelectionActionMode): void;
export declare function updateSelectionCanvasRenderData(this: Editor): void;
