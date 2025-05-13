import { ElementMap } from '~/elements/elements';
import Editor from '~/main/editor';
declare class VisibleManager {
    private visibleElementMap;
    private visibleSelected;
    private editor;
    constructor(editor: Editor);
    get values(): any[];
    get getVisibleElementMap(): ElementMap;
    get getVisibleSelected(): Set<UID>;
    get getVisibleSelectedElementMap(): ElementMap;
    updateVisibleElementMap(): void;
    updateVisibleSelected(): void;
    destroy(): void;
}
export default VisibleManager;
