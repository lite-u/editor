import { UID } from '~/core/core';
import Editor from '~/main/editor';
import { SelectionActionMode } from '~/services/selection/type';
import { ElementProps } from '~/elements/type';
declare class SelectionManager {
    protected selected: Set<UID>;
    editor: Editor;
    constructor(editor: Editor);
    has(id: UID): boolean;
    get size(): number;
    get values(): Set<UID>;
    clear(): void;
    get pickIfUnique(): ElementProps | null;
    selectAll(): void;
    modify(idSet: Set<UID>, action: SelectionActionMode): void;
    add(idSet: Set<UID>): void;
    delete(idSet: Set<UID>): void;
    toggle(idSet: Set<UID>): void;
    replace(idSet: Set<UID>): void;
    destroy(): void;
}
export default SelectionManager;
