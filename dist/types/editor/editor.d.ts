import { EditorExportFileType, EventHandlers } from './type';
import History from './history/history.ts';
import Action from './actions/actions.ts';
import { OperationHandlers, ResizeHandler, SelectionActionMode } from './selection/type';
import { Viewport, ViewportManipulationType } from './viewport/type';
import { EditorEventType } from './actions/type';
import { RectangleProps } from '../core/modules/shapes/rectangle.ts';
export interface EditorDataProps {
    id: UID;
    modules: ModuleProps[];
}
export interface EditorConfig {
    moduleIdCounter: number;
    dpr: number;
    frame: RectangleProps;
    offset: {
        x: number;
        y: number;
    };
    scale: number;
}
export interface EditorInterface {
    container: HTMLDivElement;
    data: EditorDataProps;
    events?: EventHandlers;
    config: EditorConfig;
}
declare class Editor {
    readonly id: UID;
    config: EditorConfig;
    private moduleCounter;
    readonly moduleMap: ModuleMap;
    private readonly visibleModuleMap;
    readonly action: Action;
    readonly container: HTMLDivElement;
    events: EventHandlers;
    history: History;
    viewport: Viewport;
    readonly selectedModules: Set<UID>;
    readonly visibleSelected: Set<UID>;
    readonly operationHandlers: OperationHandlers[];
    copiedItems: ModuleProps[];
    hoveredModule: UID | null;
    draggingModules: Set<UID>;
    _selectingModules: Set<UID>;
    _deselection: UID | null;
    _resizingOperator: ResizeHandler | null;
    _rotatingOperator: OperationHandlers | null;
    selectedShadow: Set<UID>;
    manipulationStatus: ViewportManipulationType;
    CopyDeltaX: number;
    CopyDeltaY: number;
    initialized: boolean;
    constructor({ container, data, events, config, }: EditorInterface);
    private init;
    get createModuleId(): UID;
    batchCreate(moduleDataList: ModuleProps[]): ModuleMap;
    batchAdd(modules: ModuleMap): ModuleMap;
    batchCopy(from: Set<UID>, includeIdentifiers?: boolean): ModuleProps[];
    batchDelete(from: Set<UID>): ModuleProps[];
    batchMove(from: Set<UID>, delta: Point): void;
    batchModify(idSet: Set<UID>, data: Partial<ModuleProps>): void;
    getModulesByIdSet(idSet: Set<UID>): ModuleMap;
    getModuleList(): ModuleInstance[];
    updateVisibleModuleMap(): void;
    updateVisibleSelected(): void;
    get getVisibleModuleMap(): ModuleMap;
    get getVisibleSelected(): Set<string>;
    get getVisibleSelectedModuleMap(): ModuleMap;
    get getSelected(): Set<UID>;
    get getMaxLayerIndex(): number;
    modifySelected(idSet: Set<UID>, action: SelectionActionMode): void;
    addSelected(idSet: Set<UID>): void;
    deleteSelected(idSet: Set<UID>): void;
    toggleSelected(idSet: Set<UID>): void;
    replaceSelected(idSet: Set<UID>): void;
    selectAll(): void;
    updateCopiedItemsDelta(): void;
    get getSelectedPropsIfUnique(): ModuleProps | null;
    execute(type: EditorEventType, data?: unknown): void;
    renderModules(): void;
    printOut(ctx: CanvasRenderingContext2D): void;
    exportToFiles(): EditorExportFileType;
    renderSelections(): void;
    updateWorldRect(): void;
    zoom(zoom: number, point?: Point): {
        x: number;
        y: number;
    };
    updateScrollBar(): void;
    updateViewport(): void;
    getWorldPointByViewportPoint(x: number, y: number): {
        x: number;
        y: number;
    };
    getViewPointByWorldPoint(x: number, y: number): {
        x: number;
        y: number;
    };
    destroy(): void;
}
export default Editor;
