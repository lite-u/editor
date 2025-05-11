import { UID } from '~/core/core';
import Editor from '~/engine/editor';
declare class Selection {
    protected selectedElementIDSet: Set<UID>;
    editor: Editor;
    constructor(editor: Editor);
    get getSelected(): Set<UID>;
    selectAll(): void;
    destroy(): void;
}
export default Selection;
