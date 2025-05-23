import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
import { BoundingRect, Point, UID } from '~/type';
export interface LineSegmentProps extends ElementBaseProps {
    type?: 'lineSegment';
    start: Point;
    end: Point;
}
export type RequiredLineSegmentProps = Required<LineSegmentProps>;
declare class ElementLineSegment extends ElementBase {
    readonly type = "lineSegment";
    start: Point;
    end: Point;
    constructor({ start, end, ...rest }: LineSegmentProps);
    static create(id: UID, sX: number, sY: number, eX: number, eY: number): ElementLineSegment;
    static _getBoundingRect(start: Point, end: Point, rotation?: number): BoundingRect;
    updatePath2D(): void;
    updateOriginal(): void;
    getBoundingRect(withoutRotation?: boolean): BoundingRect;
    getBoundingRectFromOriginal(): BoundingRect;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    toJSON(): RequiredLineSegmentProps;
    toMinimalJSON(): LineSegmentProps;
}
export default ElementLineSegment;
