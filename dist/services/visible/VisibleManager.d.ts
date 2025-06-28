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
    get getVisibleSelected(): Set<UID>;
    get getVisibleSelectedElements(): any;
    destroy(): void;
}
export default VisibleManager;
