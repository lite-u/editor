import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
import { BoundingRect, Point } from '~/type';
export interface LineSegmentProps extends ElementBaseProps {
    type?: 'lineSegment';
    points: [{
        id: 'start';
    } & Point, {
        id: 'end';
    } & Point];
}
export type RequiredLineSegmentProps = Required<LineSegmentProps>;
declare class ElementLineSegment extends ElementBase {
    readonly type = "lineSegment";
    private points;
    constructor({ points, ...rest }: LineSegmentProps);
    protected updatePath2D(): void;
    protected updateOriginal(): void;
    get getPoints(): Point[];
    static _getBoundingRect(start: Point, end: Point, rotation?: number): BoundingRect;
    getBoundingRect(withoutRotation?: boolean): BoundingRect;
    getBoundingRectFromOriginal(): BoundingRect;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    protected toJSON(): RequiredLineSegmentProps;
    toMinimalJSON(): LineSegmentProps;
}
export default ElementLineSegment;
