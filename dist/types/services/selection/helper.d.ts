import { SelectionActionMode } from './type';
import Editor from '../../engine/editor';
import { UID } from '~/core/core';
export declare function modifySelected(this: Selection, idSet: Set<UID>, action: SelectionActionMode): void;
export declare function updateSelectionCanvasRenderData(this: Editor): void;
