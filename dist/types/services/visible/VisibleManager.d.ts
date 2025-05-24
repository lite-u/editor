import { ElementMap } from '~/elements/type';
import Editor from '~/main/editor';
declare class VisibleManager {
    private visibleElementMap;
    private visibleSelected;
    private editor;
    constructor(editor: Editor);
    get values(): any[];
    getElementsAtPoint(): void;
    get getVisibleElementMap(): ElementMap;
    get getVisibleSelected(): Set<string>;
    get getVisibleSelectedElements(): any[];
    updateVisibleElementMap(): void;
    updateVisibleSelected(): void;
    destroy(): void;
}
export default VisibleManager;
