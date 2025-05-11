import { UID } from '~/core/core';
import Editor from '~/engine/editor';
import { SelectionActionMode } from '~/services/selection/type';
import { ElementProps } from '~/elements/elements';
declare class Selection {
    protected selected: Set<UID>;
    editor: Editor;
    constructor(editor: Editor);
    has(id: UID): boolean;
    get size(): number;
    get values(): Set<UID>;
    get pickIfUnique(): ElementProps | null;
    selectAll(): void;
    modify(idSet: Set<UID>, action: SelectionActionMode): void;
    add(idSet: Set<UID>): void;
    delete(idSet: Set<UID>): void;
    toggle(idSet: Set<UID>): void;
    replace(idSet: Set<UID>): void;
    destroy(): void;
}
export default Selection;
