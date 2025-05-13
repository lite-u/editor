import Base, { ElementBaseProps } from '../base/base';
import { OperationHandler } from '~/services/selection/type';
import { BoundingRect } from '~/type';
import { ElementProps } from '../elements';
import { Gradient } from '~/elements/props';
export interface ShapeProps extends ElementBaseProps {
    cx?: number;
    cy?: number;
    gradient?: Gradient;
}
export type RequiredShapeProps = Required<ShapeProps>;
declare class Shape extends Base {
    cx: number;
    cy: number;
    gradient: Gradient;
    constructor({ cx, cy, gradient, ...rest }: ShapeProps);
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
export default Shape;
