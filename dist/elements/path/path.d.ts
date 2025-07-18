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
    static _rotateBezierPointsFrom(cx: number, cy: number, rotation: number, points: BezierPoint[]): BezierPoint[];
    getBezierPoints(): BezierPoint[];
    updatePath2D(): void;
    translate(dx: number, dy: number, f: boolean): HistoryChangeItem | undefined;
    rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point, appliedRotation: number): HistoryChangeItem | undefined;
    getBoundingRect(withoutRotation?: boolean): BoundingRect;
    getBoundingRectFromOriginal(withoutRotation?: boolean): any;
    toPath(): ElementPath;
    toJSON(): RequiredShapeProps;
    toMinimalJSON(): PathProps;
}
export default ElementPath;
