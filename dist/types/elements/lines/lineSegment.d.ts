import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
import { BoundingRect, Point } from '~/type';
export interface LineSegmentProps extends ElementBaseProps {
    id: string;
    layer: number;
    type: 'lineSegment';
    points: [{
        id: 'start';
    } & Point, {
        id: 'end';
    } & Point];
}
export type RequiredLineSegmentProps = Required<LineSegmentProps>;
declare class ElementLineSegment extends ElementBase {
    readonly id: string;
    readonly layer: number;
    readonly type = "lineSegment";
    private points;
    private original;
    constructor({ id, layer, points, ...rest }: LineSegmentProps);
    get getPoints(): Point[];
    protected updatePath2D(): void;
    static _getBoundingRect(start: Point, end: Point, rotation?: number): BoundingRect;
    getBoundingRect(): BoundingRect;
    getBoundingRectFromOriginal(): BoundingRect;
    translate(dx: number, dy: number): void;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    protected toJSON(): RequiredLineSegmentProps;
    toMinimalJSON(): LineSegmentProps;
}
export default ElementLineSegment;
