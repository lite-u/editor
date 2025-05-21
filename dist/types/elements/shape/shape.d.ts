import ElementBase, { ElementBaseProps } from '../base/elementBase';
import { Point } from '~/type';
import { BezierPoint, Gradient } from '~/elements/props';
import { HistoryChangeItem } from '~/services/actions/type';
export interface ShapeProps extends ElementBaseProps {
    cx?: number;
    cy?: number;
    gradient?: Gradient;
}
export type RequiredShapeProps = Required<ShapeProps>;
declare class ElementShape extends ElementBase {
    cx: number;
    cy: number;
    gradient: Gradient;
    protected original: {
        cx: number;
        cy: number;
        rotation: number;
        points?: BezierPoint[];
        width?: number;
        height?: number;
        r1?: number;
        r2?: number;
        [key: string]: unknown;
    };
    constructor({ cx, cy, gradient, ...rest }: ShapeProps);
    translate(dx: number, dy: number, f: boolean): HistoryChangeItem | undefined;
    rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined;
    protected get center(): Point;
    protected toJSON(): RequiredShapeProps;
    toMinimalJSON(): ShapeProps;
}
export default ElementShape;
