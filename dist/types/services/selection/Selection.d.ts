import { UID } from '~/core/core';
import Editor from '~/engine/editor';
import { SelectionActionMode } from '~/services/selection/type';
import { ElementProps } from '~/elements/elements';
declare class Selection {
    protected selectedElementIDSet: Set<UID>;
    editor: Editor;
    constructor(editor: Editor);
    get getSelected(): Set<UID>;
    get getSelectedPropsIfUnique(): ElementProps | null;
    selectAll(): void;
    modifySelected(idSet: Set<UID>, action: SelectionActionMode): void;
    addSelected(idSet: Set<UID>): void;
    deleteSelected(idSet: Set<UID>): void;
    toggleSelected(idSet: Set<UID>): void;
    replaceSelected(idSet: Set<UID>): void;
    destroy(): void;
}
export default Selection;
