type SelectionActionMode = 'add' | 'delete' | 'toggle' | 'replace'

type HandlerType = 'move' | 'resize' | 'rotate';

type ResizeHandleName =
  | 'tl'
  | 't'
  | 'tr'
  | 'r'
  | 'br'
  | 'b'
  | 'bl'
  | 'l'
  | 'rotate-tl'
  | 'rotate-tr'
  | 'rotate-br'
  | 'rotate-bl'

interface OperationHandler {
  id: string;
  type: HandlerType
  /*
  * moduleOrigin is a detailed representation of the corresponding module instance.
  * */
  moduleOrigin: ModuleProps
  module: ModuleInstance
}

interface ResizeHandler extends OperationHandler {
  type: 'resize';
  name: ResizeHandleName
}

interface RotateHandler extends OperationHandler {
  type: 'rotate';
}

interface MoveHandler extends OperationHandler {
  type: 'move';
}

type OperationHandlers = RotateHandler | ResizeHandler | MoveHandler

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

type Rect = Size & Point
type CenterBasedRect = Rect
type BoundingRect = Size & Point & {
  top: number;
  bottom: number;
  left: number;
  right: number;
  cx: number;
  cy: number;
}

type UID = string
type HexColor = string
type FillColor = HexColor
type Opacity = number
type Rotation = number
type Shadow = string
type Gradient = string

interface BasicModuleProps {
    id: UID;
    layer: number;
    enableLine?: boolean;
    lineColor: HexColor;
    lineWidth: number;
    opacity: Opacity;
    shadow?: string;
    rotation?: number;
}
declare class Base {
    id: UID;
    enableLine: boolean;
    lineWidth: number;
    lineColor: HexColor;
    opacity: Opacity;
    rotation: Rotation;
    shadow: Shadow;
    layer: number;
    constructor({ id, lineColor, lineWidth, opacity, layer, rotation, shadow, enableLine, }: BasicModuleProps);
    protected getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? BasicModuleProps : Omit<BasicModuleProps, 'id' & 'layer'>;
    protected getBoundingRect(): BoundingRect;
    protected render(_ctx: CanvasRenderingContext2D): void;
    static applyRotating(this: Editor, shiftKey: boolean): number;
}

interface ShapeProps extends BasicModuleProps {
    x: number;
    y: number;
    enableGradient?: boolean;
    gradient?: Gradient;
    enableFill?: boolean;
    fillColor?: FillColor;
    dashLine?: string;
}
declare class Shape extends Base {
    x: number;
    y: number;
    fillColor: FillColor;
    enableFill: boolean;
    constructor({ x, y, fillColor, enableFill, ...rest }: ShapeProps);
    getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? ShapeProps : Omit<ShapeProps, 'id' & 'layer'>;
    move(x: number, y: number): void;
    getOperators(resizeConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, rotateConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, boundingRect: CenterBasedRect, moduleOrigin: ModuleProps): OperationHandlers[];
    isInsideRect(outer: BoundingRect): boolean;
}

interface RectangleProps extends ShapeProps {
    width: number;
    height: number;
    radius?: number;
    type: 'rectangle';
}
declare class Rectangle extends Shape {
    readonly type = "rectangle";
    width: number;
    height: number;
    radius: number;
    constructor({ width, height, radius, ...rest }: Omit<RectangleProps, 'type'>);
    hitTest(point: Point, borderPadding?: number): 'inside' | 'border' | null;
    static applyResizeTransform: ({ downPoint, movePoint, moduleOrigin, rotation, handleName, scale, dpr, altKey, shiftKey, }: {
        downPoint: {
            x: number;
            y: number;
        };
        movePoint: {
            x: number;
            y: number;
        };
        moduleOrigin: RectangleProps;
        rotation: number;
        handleName: ResizeHandleName;
        scale: number;
        dpr: number;
        altKey?: boolean;
        shiftKey?: boolean;
    }) => Rect;
    getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>;
    getRect(): CenterBasedRect;
    getBoundingRect(): BoundingRect;
    getSelectedBoxModule(lineWidth: number, lineColor: string): Rectangle;
    getHighlightModule(lineWidth: number, lineColor: string): ModuleInstance;
    getOperators(resizeConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, rotateConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }): OperationHandlers[];
    getSnapPoints(): SnapPointData[];
    render(ctx: CanvasRenderingContext2D): void;
}

interface EllipseProps extends ShapeProps {
    r1: number;
    r2: number;
    type: 'ellipse';
}
declare class Ellipse extends Shape {
    readonly type = "ellipse";
    r1: number;
    r2: number;
    constructor({ fillColor, enableFill, r1, r2, ...rest }: Omit<EllipseProps, 'type'>);
    static applyResizeTransform: ({ downPoint, movePoint, moduleOrigin, rotation, handleName, scale, dpr, altKey, shiftKey, }: {
        downPoint: {
            x: number;
            y: number;
        };
        movePoint: {
            x: number;
            y: number;
        };
        moduleOrigin: EllipseProps;
        rotation: number;
        handleName: ResizeHandleName;
        scale: number;
        dpr: number;
        altKey?: boolean;
        shiftKey?: boolean;
    }) => Point & {
        r1: number;
        r2: number;
    };
    hitTest(point: Point, borderPadding?: number): 'inside' | 'border' | null;
    getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? EllipseProps : Omit<EllipseProps, 'id' & 'layer'>;
    getBoundingRect(): BoundingRect;
    getRect(): CenterBasedRect;
    getSelectedBoxModule(lineWidth: number, lineColor: string): Rectangle;
    getHighlightModule(lineWidth: number, lineColor: string): Ellipse;
    getOperators(resizeConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, rotateConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }): OperationHandlers[];
    getSnapPoints(): SnapPointData[];
    render(ctx: CanvasRenderingContext2D): void;
}

type ModuleProps = RectangleProps | EllipseProps
type PropsWithoutIdentifiersA = Omit<ModuleProps, 'id' & 'layer'>
type ModuleInstance = Rectangle | Ellipse
type ModuleMap = Map<UID, ModuleInstance>

interface SelectionModifyData {
  mode: SelectionActionMode;
  idSet: Set<UID>;
}

type EditorEventType = keyof EditorEventMap;
type EditorEventData<T extends EditorEventType> = EditorEventMap[T];

type ModuleMoveData = {
  idSet?: Set<UID>;
  delta: Point;
};

type PropChange<T> = {
  from: T
  to: T
}

type HistoryModuleChangeItem = {
  id: UID
  props: HistoryModuleChangeProps
}

type HistoryModuleChangeProps = {
  [K in keyof ModuleProps]?: PropChange<ModuleProps[K]>
}

interface ModuleModifyData {
  id: UID
  props: Partial<ModuleProps>
}

type EditorEventMap = {
  // 'editor-initialized': never;
  'world-resized': null;
  'world-mouse-down': never;
  'world-mouse-move': never;
  'world-updated': never;
  'world-zoom': 'fit' | {
    zoomBy?: boolean
    zoomTo?: boolean
    zoomFactor: number;
    physicalPoint?: Point;
  };
  'world-shift': Point;
  'render-modules': boolean;
  'render-selection': never;
  'selection-updated': never
  'selection-modify': SelectionModifyData;
  'selection-clear': never;
  'selection-all': never;
  'module-updated': HistoryOperation;
  'module-copy': never;
  'module-add': PropsWithoutIdentifiersA[];
  'module-paste': Point;
  'module-delete': never;
  'module-duplicate': never;
  'module-layer': { method: 'up' | 'down' | 'top' | 'bottom', idSet: Set<UID> };
  'module-move': ModuleMoveData;
  'module-modify': ModuleModifyData[]
  'module-modifying': {
    type: 'move' | 'resize' | 'rotate',
    data: Partial<ModuleProps>
  }
  'module-hover-enter': UID;
  'module-hover-leave': UID;
  'visible-module-updated': never;
  'visible-selection-updated': never;
  'history-redo': never;
  'history-undo': never;
  'history-pick': HistoryNode;
  'context-menu': {
    idSet: Set<UID>;
    position: Point;
    copiedItems: boolean
  };
}

type HistoryPrev = HistoryNode | null
type HistoryNext = HistoryPrev
type HistorySelectedModules = Set<UID>
type HistoryModules = ModuleProps[]

// 🧱 Base HistoryOperation Union with Selection Tracking
type HistoryOperation =
  | InitOperation
  | AddOperation
  | DeleteOperation
  | PasteOperation
  | DuplicateOperation
  | ModifyOperation
  | MoveOperation
  | ReorderOperation
  // | SelectOperation
  | GroupOperation
  | UngroupOperation
  | CompositeOperation

// 🔧 Action Definitions

// 1. Initialization of state
interface InitOperation {
  type: 'history-init'
  payload: {
    state: null,
    selectedModules: HistorySelectedModules
    // state: ModuleMap // full initial state of the modules
    // HistorySelectedModules
  }
}

// 2. Adding modules to the system
interface AddOperation {
  type: 'history-add'
  payload: {
    modules: HistoryModules // newly added modules with their full data
    selectedModules: HistorySelectedModules
  }
}

// 3. Deleting modules from the system
interface DeleteOperation {
  type: 'history-delete'
  payload: {
    modules: HistoryModules // full data of deleted modules, to restore them
    selectedModules: HistorySelectedModules
  }
}

// 4. Pasting modules into the scene
interface PasteOperation {
  type: 'history-paste'
  payload: {
    modules: HistoryModules // modules that were pasted into the scene
    selectedModules: HistorySelectedModules
  }
}

// 5. Duplicating modules
interface DuplicateOperation {
  type: 'history-duplicate'
  payload: {
    // sourceIds: string[] // ids of the original modules being duplicated
    modules: HistoryModules  // the new duplicated modules
    selectedModules: HistorySelectedModules
  }
}

// 6. Modifying module properties
interface ModifyOperation {
  type: 'history-modify'
  payload: {
    changes: HistoryModuleChangeItem[]
    selectedModules: HistorySelectedModules
  }
}

// 7. Moving modules
interface MoveOperation {
  type: 'history-move'
  payload: {
    delta: { x: number, y: number } // amount by which to move (x and y deltas)
    // modules: HistoryModules // ids of the modules to move
    selectedModules: HistorySelectedModules
  }
}

// 8. Reordering modules
interface ReorderOperation {
  type: 'history-reorder'
  payload: {
    from: string[] // old order of module ids
    to: string[]   // new order of module ids
    selectedModules: HistorySelectedModules
  }
}

// 9. Selecting modules
/*interface SelectOperation {
  type: 'history-select'
  payload: {
    from: string[] // Previously selected module IDs
    to: string[]   // Currently selected module IDs
  }
}*/

// 10. Grouping modules together
interface GroupOperation {
  type: 'history-group'
  payload: {
    groupId: string // ID of the newly created group
    children: string[] // IDs of the modules being grouped
    selectedModules: HistorySelectedModules
  }
}

// 11. Ungrouping modules
interface UngroupOperation {
  type: 'history-ungroup'
  payload: {
    groupId: string // ID of the group being ungrouped
    children: HistoryModules // full modules being ungrouped
    selectedModules: HistorySelectedModules
  }
}

// 12. Composite operation (group multiple actions as one)
interface CompositeOperation {
  type: 'history-composite'
  payload: {
    actions: HistoryOperationA[] // list of actions to be treated as a single undo/redo unit
    selectedModules: HistorySelectedModules
  }
}

declare class HistoryNode {
    data: HistoryOperation;
    prev: HistoryPrev;
    next: HistoryNext;
    id: number;
    constructor(prev: HistoryPrev, next: HistoryNext, data: HistoryOperation, id?: number);
}
declare class DoublyLinkedList {
    head: HistoryNode | null;
    tail: HistoryNode | null;
    current: HistoryNode | null;
    constructor();
    /**
     * Detach: detach all nodes after current
     */
    protected detach(): HistoryNode | null;
    protected append(data: HistoryOperation): HistoryNode;
    protected back(): HistoryNode | false;
    protected forward(): HistoryNode | false;
    /**
     * 'front' : target node in front of current node
     * 'behind' : target node behind of current node
     * 'equal' : target node equal to current node
     * false : target node not belong to this linked list
     */
    protected compareToCurrentPosition(node: HistoryNode): 'front' | 'equal' | 'behind' | false;
    destroy(): void;
}

declare class History extends DoublyLinkedList {
    private editor;
    constructor(editor: Editor);
    init(): void;
    add(data: HistoryOperation): void;
    toArray(): HistoryNode[];
    compareToCurrentPosition(node: HistoryNode): false | "front" | "equal" | "behind";
    forward(): HistoryNode | false;
    back(): HistoryNode | false;
}

interface ViewportData extends Size {
  offsetX: number
  offsetY: number
  scale: number
  // dx: number
  // dy: number
  status: string
}

interface WorldInfo extends Size {
  offsetX: number
  offsetY: number
  scale: number
  dx: number
  dy: number
  status: string
}

interface SnapPointData extends Point {
  id: UID,
  type: string
}

type InitializedHandler = () => void;
type HistoryUpdatedHandler = (history: History) => void;
type ModulesUpdatedHandler = (moduleMap: ModuleMap) => void;
type SelectionUpdatedHandler = (selected: Set<UID>, selectedProps?: ModuleProps) => void;
type ViewportUpdatedHandler = (viewportInfo: ViewportData) => void;
type WorldUpdatedHandler = (worldInfo: WorldInfo) => void;
type WorldMouseMoveUpdatedHandler = (point: Point) => void;
type ContextMenuHandler = (position: Point) => void;
type ModuleCopiedHandler = (p:ModuleProps[]) => void;

declare type EventHandlers = {
  onInitialized?: InitializedHandler
  onHistoryUpdated?: HistoryUpdatedHandler
  onModulesUpdated?: ModulesUpdatedHandler
  onSelectionUpdated?: SelectionUpdatedHandler
  onViewportUpdated?: ViewportUpdatedHandler
  onWorldUpdated?: WorldUpdatedHandler
  onWorldMouseMove?: WorldMouseMoveUpdatedHandler
  onContextMenu?: ContextMenuHandler
  onModuleCopied?: ModuleCopiedHandler
}

interface EditorExportFileType {
  data: ModuleProps[]
  id: UID,
  config: EditorConfig
}

type EventsCallback<K extends EditorEventType> = EditorEventData<K> extends never ? () => void : (data: EditorEventData<K>) => void;
declare class Action {
    private readonly eventsMap;
    constructor();
    on<K extends EditorEventType>(eventName: K, callback: EventsCallback<K>): void;
    off<K extends EditorEventType>(eventName: K, callback: EventsCallback<K>): "deleted" | "Cannot find event or function" | undefined;
    dispatch<K extends EditorEventType>(type: K, data?: EditorEventData<K>): void;
    execute<K extends EditorEventType>(type: K, data: EditorEventData<K>): void;
    destroy(): void;
}

type ViewportManipulationType =
  | 'static'
  | 'waiting'
  | 'panning'
  | 'dragging'
  | 'resizing'
  | 'rotating'
  | 'zooming'
  | 'selecting'

interface Viewport {
  resizeObserver: ResizeObserver
  wrapper: HTMLDivElement
  scrollBarX: HTMLDivElement
  scrollBarY: HTMLDivElement
  selectionBox: HTMLDivElement
  selectionCanvas: HTMLCanvasElement
  cursor: HTMLDivElement
  selectionCTX: CanvasRenderingContext2D
  mainCanvas: HTMLCanvasElement
  mainCTX: CanvasRenderingContext2D
  eventsController: AbortController
  initialized: boolean
  dpr: number
  spaceKeyDown: boolean
  zooming: boolean
  /*
  * frame
  *
  * A rect that based on world coordinate, x=0, y=0
  * Its size can be modified
  * */
  frame: Rectangle
  /*
  * mouseDownPoint
  * relative position to wrapper's top-left
  * */
  mouseDownPoint: Point
  mouseMovePoint: Point
  offset: Point
  /* BoundingRect in the browser dom model*/
  rect: BoundingRect
  /*
  * viewportRect:
  *
  * Its width equals to Canvas real width, and height also
  *
  * width = canvas.style.width * dpr
  *
  * height = canvas.style.height * dpr
  * */
  viewportRect: BoundingRect
  worldRect: BoundingRect
  scale: number
  enableCrossLine: boolean
  drawCrossLineDefault: boolean
  drawCrossLine: boolean
}

interface EditorDataProps {
    id: UID;
    modules: ModuleProps[];
}
interface EditorConfig {
    moduleIdCounter: number;
    dpr: number;
    frame: RectangleProps;
    offset: {
        x: number;
        y: number;
    };
    scale: number;
}
interface EditorInterface {
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

export { Editor as default };
