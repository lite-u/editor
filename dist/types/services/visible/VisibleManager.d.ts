import { ElementMap } from '~/elements/elements';
import Editor from '~/main/editor';
declare class VisibleManager {
    private readonly visibleElementMap;
    private readonly visibleSelected;
    readonly editor: Editor;
    constructor(editor: Editor);
    get values(): any[];
    get getVisibleElementMap(): ElementMap;
    get getVisibleSelected(): Set<string>;
    get getVisibleSelectedElementMap(): ElementMap;
    updateVisibleElementMap(): void;
    updateVisibleSelected(): void;
}
export default VisibleManager;
