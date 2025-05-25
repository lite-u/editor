import Editor from '~/main/editor';
import { ElementInstance, ElementMap, ElementProps, OptionalIdentifiersProps } from '~/elements/type';
import { Point, UID } from '~/type';
declare class CanvasHost {
    editor: Editor;
    protected elementMap: ElementMap;
    eventsController: AbortController;
    _hoveredElement: ElementInstance | null;
    dispatchEvent(domEvent: PointerEvent, type: PointerEvent['type'], options?: {
        tolerance?: number;
    }): void;
    constructor(editor: Editor);
    has(id: string): boolean;
    get size(): number;
    get keys(): Set<UID>;
    get values(): ElementInstance[];
    get all(): ElementMap;
    get getMaxLayerIndex(): number;
    getElementById(id: string): ElementInstance | undefined;
    getElementsByIdSet(idSet: Set<UID>): ElementInstance[];
    getElementMapByIdSet(idSet: Set<UID>): ElementMap;
    create(data: OptionalIdentifiersProps): ElementInstance | false;
    batchCreate(elementDataList: ElementProps[]): ElementMap;
    add(element: ElementInstance): ElementInstance;
    batchAdd(elements: ElementMap, callback?: VoidFunction): ElementMap;
    batchCopy(idSet: Set<UID>, includeIdentifiers?: boolean): ElementProps[];
    batchDelete(idSet: Set<UID>): ElementProps[];
    batchMove(from: Set<UID>, delta: Point): void;
    batchModify(idSet: Set<UID>, data: Partial<ElementProps>): void;
    destroy(): void;
}
export default CanvasHost;
