import { BoundingRect, ElementProps, Point, UID } from '~/type';
import { BezierPoint, Fill, Gradient, Shadow, Stroke, Transform } from '~/elements/props';
import { HistoryChangeItem } from '~/services/actions/type';
import { CanvasHostEvent } from '~/services/element/CanvasHost';
import ElementPath from '~/elements/path/path';
type ElementEventHandler<T = any> = (payload: T) => void;
interface ElementEventMap {
    onmouseenter: {
        dx: number;
        dy: number;
    };
    onmouseleave: {
        dx: number;
        dy: number;
    };
    onmousedown: {
        scaleX: number;
        scaleY: number;
    };
    onmousemove: {
        angle: number;
    };
    [key: string]: any;
}
export interface ElementBaseProps {
    id: UID;
    layer: number;
    stroke?: Stroke;
    fill?: Fill;
    opacity?: number;
    shadow?: Shadow;
    rotation?: number;
    transform?: Transform;
    show?: boolean;
    cx?: number;
    cy?: number;
    gradient?: Gradient;
}
export type RequiredBaseProps = Required<ElementBaseProps>;
declare class ElementBase {
    id: UID;
    layer: number;
    cx: number;
    cy: number;
    gradient: Gradient;
    stroke: Stroke;
    fill: Fill;
    opacity: number;
    shadow: Shadow;
    rotation: number;
    transform: Transform;
    show: boolean;
    path2D: Path2D;
    boundingRect: BoundingRect;
    originalBoundingRect: BoundingRect;
    originalBoundingRectWithRotation: BoundingRect;
    _shadowPath?: ElementPath;
    _transforming: boolean;
    protected original: {
        cx: number;
        cy: number;
        rotation: number;
        points?: BezierPoint[];
        start?: Point;
        end?: Point;
        width?: number;
        height?: number;
        r1?: number;
        r2?: number;
        closed?: boolean;
        [key: string]: unknown;
    };
    protected eventListeners: {
        [K in keyof ElementEventMap]?: ElementEventHandler<ElementEventMap[K]>[];
    };
    onmouseenter?: (event: CanvasHostEvent) => void;
    onmouseleave?: (event: CanvasHostEvent) => void;
    onmousedown?: (event: CanvasHostEvent) => void;
    onmousemove?: (event: CanvasHostEvent) => void;
    onmouseup?: (event: CanvasHostEvent) => void;
    constructor({ id, layer, cx, cy, gradient, stroke, fill, opacity, rotation, shadow, transform, show, }: ElementBaseProps);
    static transformPoint(x: number, y: number, matrix: DOMMatrix): Point;
    on<K extends keyof ElementEventMap>(event: K, handler: ElementEventHandler<ElementEventMap[K]>): void;
    dispatchEvent(eventData: {
        type: string;
        [key: string]: any;
    }): void;
    set transforming(v: boolean);
    translate(dx: number, dy: number, f?: boolean): HistoryChangeItem | undefined;
    updateOriginal(): void;
    updateBoundingRect(): void;
    updateOriginalBoundingRect(): void;
    protected rotateFrom(rotation: number, anchor: Point, f?: boolean): HistoryChangeItem | undefined;
    protected get center(): Point;
    toJSON(): RequiredBaseProps;
    protected toMinimalJSON(): ElementBaseProps;
    protected getBoundingRect(): BoundingRect;
    protected getBoundingRectFromOriginal(withoutRotation?: boolean): BoundingRect;
    toPath(): ElementPath;
    updateTransform(): void;
    updatePath2D(): void;
    restore(props: Partial<ElementProps>): void;
    protected getTransformedPoints(): Point[];
    protected getCenter(): Point;
    clone(): any;
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementBase;
