import Editor from '~/engine/editor';
import { ElementInstance, ElementMap, ElementProps } from '~/elements/elements';
import { UID } from '~/core/core';
import { Point } from '~/type';
declare class ElementManager {
    protected elementMap: ElementMap;
    editor: Editor;
    constructor(editor: Editor);
    init(): void;
    getAllIDSet(): Set<UID>;
    get getMaxLayerIndex(): number;
    getElementMapByIdSet(idSet: Set<UID>): ElementMap;
    create(data: ElementProps): ElementInstance | false;
    batchCreate(moduleDataList: ElementProps[]): ElementMap;
    add(element: ElementInstance): ElementInstance;
    batchAdd(modules: ElementMap, callback?: VoidFunction): ElementMap;
    batchCopy(idSet: Set<UID>, includeIdentifiers?: boolean): ElementProps[];
    batchDelete(idSet: Set<UID>): ElementProps[];
    batchMove(from: Set<UID>, delta: Point): void;
    batchModify(idSet: Set<UID>, data: Partial<ElementProps>): void;
    destroy(): void;
}
export default ElementManager;
