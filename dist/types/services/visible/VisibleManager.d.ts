import { ElementMap } from '~/elements/type';
import Editor from '~/main/editor';
declare class VisibleManager {
    private visibleElementMap;
    private visibleSelected;
    private editor;
    constructor(editor: Editor);
    get values(): import("~/type").ElementInstance[];
    getElementsAtPoint(): void;
    get getVisibleElementMap(): ElementMap;
    get getVisibleSelected(): Set<string>;
    get getVisibleSelectedElements(): import("~/type").ElementInstance[];
    updateVisibleElementMap(): void;
    updateVisibleSelected(): void;
    destroy(): void;
}
export default VisibleManager;
