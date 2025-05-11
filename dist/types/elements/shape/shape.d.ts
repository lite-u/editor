import Base, { ElementBaseProps } from '../base/base';
import { OperationHandlers } from '~/engine/selection/type';
import { ElementFillColor } from '~/core/core';
import { BoundingRect } from '~/type';
import { ModuleProps } from '../elements';
export interface ShapeCreationProps extends ElementBaseProps {
    cx?: number;
    cy?: number;
    enableGradient?: boolean;
    gradient?: string;
    enableFill?: boolean;
    fillColor?: ElementFillColor;
    dashLine?: string;
}
export type RequiredShapeProps = Required<ShapeCreationProps>;
declare class Shape extends Base {
    cx: number;
    cy: number;
    readonly fillColor: ElementFillColor;
    readonly enableFill: boolean;
    enableGradient: boolean;
    gradient: string;
    dashLine: string;
    constructor({ cx, cy, enableGradient, gradient, enableFill, fillColor, dashLine, ...rest }: ShapeCreationProps);
    protected toJSON(): RequiredShapeProps;
    toMinimalJSON(): ShapeCreationProps;
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
    }, boundingRect: BoundingRect, moduleOrigin: ModuleProps): OperationHandlers[];
    isInsideRect(outer: BoundingRect): boolean;
}
export default Shape;
