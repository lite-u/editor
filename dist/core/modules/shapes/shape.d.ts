import Base, { BasicModuleProps } from '../base.ts';
import { OperationHandlers } from '../../../main/selection/type';
export interface ShapeProps extends BasicModuleProps {
    x: number;
    y: number;
    enableGradient?: boolean;
    gradient?: Gradient;
    enableFill?: boolean;
    fillColor?: FillColor;
    dashLine?: string;
}
declare class Shape extends Base {
    x: number;
    y: number;
    readonly fillColor: FillColor;
    readonly enableFill: boolean;
    constructor({ x, y, fillColor, enableFill, ...rest }: ShapeProps);
    getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? ShapeProps : Omit<ShapeProps, 'id' & 'layer'>;
    move(x: number, y: number): void;
    getOperators(resizeConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, rotateConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, boundingRect: CenterBasedRect, moduleOrigin: ModuleProps): OperationHandlers[];
    isInsideRect(outer: BoundingRect): boolean;
}
export default Shape;
