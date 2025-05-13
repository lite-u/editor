import Base, { ElementBaseProps } from '../base/base';
import { OperationHandlers } from '~/services/selection/type';
import { ElementFillColor } from '~/core/core';
import { BoundingRect } from '~/type';
import { ElementProps } from '../elements';
export interface ShapeProps extends ElementBaseProps {
    cx?: number;
    cy?: number;
    enableGradient?: boolean;
    gradient?: string;
}
export type RequiredShapeProps = Required<ShapeProps>;
declare class Shape extends Base {
    cx: number;
    cy: number;
    readonly fillColor: ElementFillColor;
    readonly enableFill: boolean;
    enableGradient: boolean;
    gradient: string;
    dashLine: string;
    constructor({ cx, cy, enableGradient, gradient, ...rest }: ShapeProps);
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
    }, boundingRect: BoundingRect, moduleOrigin: ElementProps): OperationHandlers[];
    isInsideRect(outer: BoundingRect): boolean;
}
export default Shape;
