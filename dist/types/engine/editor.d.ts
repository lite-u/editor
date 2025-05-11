import { EditorConfig, EditorExportFileType, EventHandlers } from './type';
import History from '~/services/history/history';
import Action from '~/services/actions/actions';
import { OperationHandlers } from '~/services/selection/type';
import AssetsManager from '~/services/assets/AssetsManager';
import { ElementMap, ElementProps } from '~/elements/elements';
import { UID } from '~/core/core';
import { Point, VisionEditorAssetType, VisionEventType } from '~/type';
import ElementManager from '~/services/element/ElementManager';
import SelectionManager from '~/services/selection/SelectionManager';
import Cursor from '~/services/cursor/cursor';
import Viewport from '~/services/viewport/Viewport';
declare class Editor {
    id: string;
    config: EditorConfig;
    readonly container: HTMLDivElement;
    events: EventHandlers;
    action: Action;
    cursor: Cursor;
    history: History;
    viewport: Viewport;
    elementManager: ElementManager;
    selection: SelectionManager;
    assetsManager: AssetsManager;
    readonly visibleSelected: Set<UID>;
    readonly operationHandlers: OperationHandlers[];
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
    updateVisibleElementMap(): void;
    updateVisibleSelected(): void;
    updateCopiedItemsDelta(): void;
    execute(type: VisionEventType, data?: unknown): void;
    renderModules(): void;
    printOut(ctx: CanvasRenderingContext2D): void;
    export(): EditorExportFileType;
    renderSelections(): void;
    updateWorldRect(): void;
    zoom(zoom: number, point?: Point): {
        x: number;
        y: number;
    };
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
