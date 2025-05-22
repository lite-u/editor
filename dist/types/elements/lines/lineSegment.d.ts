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
    static createByPoints(start: Point, end: Point): {
        cx: number;
        cy: number;
        points: {
            id: string;
            x: number;
            y: number;
        }[];
    };
    static _getBoundingRect(start: Point, end: Point, rotation?: number): BoundingRect;
    updatePath2D(): void;
    updateOriginal(): void;
    get getPoints(): Point[];
    getBoundingRect(withoutRotation?: boolean): BoundingRect;
    getBoundingRectFromOriginal(): BoundingRect;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    toJSON(): RequiredLineSegmentProps;
    toMinimalJSON(): LineSegmentProps;
}
export default ElementLineSegment;
