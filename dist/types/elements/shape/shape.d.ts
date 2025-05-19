import ElementBase, { ElementBaseProps } from '../base/elementBase';
import { OperationHandler } from '~/services/selection/type';
import { BoundingRect, Point } from '~/type';
import { ElementProps } from '../type';
import { Gradient } from '~/elements/props';
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
    private original;
    constructor({ cx, cy, gradient, ...rest }: ShapeProps);
    translate(dx: number, dy: number): HistoryChangeItem;
    protected get center(): Point;
    protected toJSON(): RequiredShapeProps;
    toMinimalJSON(): ShapeProps;
    move(x: number, y: number): void;
    getOperators(id: string, resizeConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, rotateConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, elementOrigin: ElementProps): OperationHandler[];
    isInsideRect(outer: BoundingRect): boolean;
}
export default ElementShape;
