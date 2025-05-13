import Base, { ElementBaseProps } from '../base/base';
import { OperationHandler } from '~/services/selection/type';
import { ElementFillColor } from '~/core/core';
import { BoundingRect } from '~/type';
import { ElementProps } from '../elements';
import { AnchorPoint, Appearance, BlendMode, Fill, Stroke, Transform } from '~/elements/defaultProps';
export type Path = {
    id: string;
};
export interface PathProps extends ElementBaseProps {
    closed: boolean;
    anchorPoints: AnchorPoint[];
    stroke: Stroke;
    fill: Fill;
    opacity: number;
    blendMode: BlendMode;
    transform: Transform;
    appearance: Appearance;
    layer: string;
    group: string | null;
    visible: boolean;
}
export type RequiredShapeProps = Required<PathProps>;
declare class Shape extends Base {
    cx: number;
    cy: number;
    readonly fillColor: ElementFillColor;
    readonly enableFill: boolean;
    enableGradient: boolean;
    gradient: string;
    dashLine: string;
    constructor({ cx, cy, enableGradient, gradient, enableFill, fillColor, dashLine, ...rest }: PathProps);
    protected toJSON(): RequiredShapeProps;
    toMinimalJSON(): PathProps;
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
    }, boundingRect: BoundingRect, elementOrigin: ElementProps): OperationHandler[];
    isInsideRect(outer: BoundingRect): boolean;
}
export default Shape;
