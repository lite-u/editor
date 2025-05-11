import { EditorConfig, EventHandlers } from './type';
import History from '~/services/history/history';
import Action from '~/services/actions/actions';
import { OperationHandlers, ResizeHandler, SelectionActionMode } from './selection/type';
import { Viewport, ViewportManipulationType } from './viewport/type';
import AssetsManager, { VisionEditorAssetType } from '~/services/assetsManager/AssetsManager';
import { ElementInstance, ElementMap, ElementProps } from '~/elements/elements';
import { UID } from '~/core/core';
import { Tool } from '~/engine/tools/tool';
import { Point, VisionEventType } from '~/type';
import ElementManager from '~/services/elementManager/ElementManager';
import Selection from '~/services/selection/Selection';
declare class Editor {
    id: string;
    config: EditorConfig;
    refs: Record<string, HTMLElement>;
    readonly action: Action;
    readonly container: HTMLDivElement;
    events: EventHandlers;
    history: History;
    elementManager: ElementManager;
    selection: Selection;
    viewport: Viewport;
    readonly selectedElementIDSet: Set<UID>;
    readonly visibleSelected: Set<UID>;
    readonly operationHandlers: OperationHandlers[];
    assetsManager: AssetsManager;
    copiedItems: ElementProps[];
    hoveredModule: UID | null;
    draggingModules: Set<UID>;
    _selectingModules: Set<UID>;
    _deselection: UID | null;
    _resizingOperator: ResizeHandler | null;
    _rotatingOperator: OperationHandlers | null;
    selectedShadow: Set<UID>;
    manipulationStatus: ViewportManipulationType;
    toolMap: Map<string, Tool>;
    CopyDeltaX: number;
    CopyDeltaY: number;
    initialized: boolean;
    currentToolName: string;
    private readonly visibleElementMap;
    constructor({ container, elements, assets, events, config, }: {
        container: HTMLDivElement;
        assets: VisionEditorAssetType[];
        elements: ElementProps[];
        events?: EventHandlers;
        config: EditorConfig;
    });
    get getVisibleElementMap(): ElementMap;
    get getVisibleSelected(): Set<string>;
    get getVisibleSelectedElementMap(): ElementMap;
    get getSelectedPropsIfUnique(): ElementProps | null;
    getModuleList(): ElementInstance[];
    updateVisibleelementMap(): void;
    updateVisibleSelected(): void;
    modifySelected(idSet: Set<UID>, action: SelectionActionMode): void;
    addSelected(idSet: Set<UID>): void;
    deleteSelected(idSet: Set<UID>): void;
    toggleSelected(idSet: Set<UID>): void;
    replaceSelected(idSet: Set<UID>): void;
    updateCopiedItemsDelta(): void;
    execute(type: VisionEventType, data?: unknown): void;
    renderModules(): void;
    printOut(ctx: CanvasRenderingContext2D): void;
    export(): {
        elements: ElementProps[];
        assets: never[];
        config: {
            offset: {
                x: number;
                y: number;
            };
        };
    };
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
