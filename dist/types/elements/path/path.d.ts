import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
import { BoundingRect, Point } from '~/type';
import { BezierPoint } from '~/elements/props';
import { HistoryChangeItem } from '~/services/actions/type';
export interface PathProps extends ElementBaseProps {
    type: 'path';
    points: BezierPoint[];
    closed: boolean;
}
export type RequiredShapeProps = Required<PathProps>;
declare class ElementPath extends ElementBase {
    readonly type = "path";
    private points;
    closed: boolean;
    constructor({ points, closed, ...rest }: PathProps);
    updateOriginal(): void;
    /**
     * Return absolute position points
     */
    getBezierPoints(): BezierPoint[];
    updatePath2D(): void;
    translate(dx: number, dy: number, f: boolean): HistoryChangeItem | undefined;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    static _rotatePoints(cx: number, cy: number, rotation: number, points: BezierPoint[]): BoundingRect;
    getBoundingRectFromOriginal(): BoundingRect;
    getBoundingRect(withoutRotation?: boolean): BoundingRect;
    toJSON(): RequiredShapeProps;
    toMinimalJSON(): PathProps;
}
export default ElementPath;
