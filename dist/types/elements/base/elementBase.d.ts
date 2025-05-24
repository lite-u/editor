import { BoundingRect, ElementProps, Point, UID } from '~/type';
import { BezierPoint, Fill, Gradient, Shadow, Stroke, Transform } from '~/elements/props';
import { HistoryChangeItem } from '~/services/actions/type';
type ElementEventHandler<T = any> = (payload: T) => void;
interface ElementEventMap {
    move: {
        dx: number;
        dy: number;
    };
    translate: {
        dx: number;
        dy: number;
    };
    resize: {
        scaleX: number;
        scaleY: number;
    };
    rotate: {
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
    constructor({ id, layer, cx, cy, gradient, stroke, fill, opacity, shadow, rotation, transform, show, }: ElementBaseProps);
    static transformPoint(x: number, y: number, matrix: DOMMatrix): Point;
    on<K extends keyof ElementEventMap>(event: K, handler: ElementEventHandler<ElementEventMap[K]>): void;
    protected translate(dx: number, dy: number, f: boolean): HistoryChangeItem | undefined;
    protected updateOriginal(): void;
    protected rotate(angle: number): void;
    protected rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined;
    protected get center(): Point;
    protected toJSON(): RequiredBaseProps;
    protected toMinimalJSON(): ElementBaseProps;
    protected getBoundingRect(): BoundingRect;
    protected updatePath2D(): void;
    protected restore(props: Partial<ElementProps>): void;
    protected getTransformedPoints(): Point[];
    protected getCenter(): Point;
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementBase;
