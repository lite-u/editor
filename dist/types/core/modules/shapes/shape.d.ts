import Base, { BasicModuleProps } from '../base';
import { OperationHandlers } from '../../../main/selection/type';
import { ModuleProps } from '../type';
import { FillColor, Gradient } from '../../type';
import { BoundingRect, CenterBasedRect } from '../../../type';
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
    fillColor: FillColor;
    enableFill: boolean;
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
