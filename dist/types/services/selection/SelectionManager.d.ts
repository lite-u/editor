import Editor from '~/main/editor';
import { SelectionActionMode } from '~/services/selection/type';
import { ElementProps } from '~/elements/type';
import { UID } from '~/type';
declare class SelectionManager {
    protected selected: Set<UID>;
    editor: Editor;
    constructor(editor: Editor);
    has(id: UID): boolean;
    get size(): number;
    get values(): Set<UID>;
    clear(): void;
    get pickIfUnique(): ElementProps | undefined;
    selectAll(): void;
    modify(idSet: Set<UID>, action: SelectionActionMode): void;
    add(idSet: Set<UID>): void;
    delete(idSet: Set<UID>): void;
    toggle(idSet: Set<UID>): void;
    replace(idSet: Set<UID>): void;
    destroy(): void;
}
export default SelectionManager;
