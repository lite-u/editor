import { OperationHandlers } from '~/engine/selection/type';
import { ElementFillColor } from '~/core/core';
import Shape from '~/elements/shape/shape';
declare abstract class RectangleLikeAbstract extends Shape {
    abstract type: string;
    abstract cx: number;
    abstract cy: number;
    abstract fillColor: ElementFillColor;
    abstract enableFill: boolean;
    abstract enableGradient: boolean;
    abstract gradient: string;
    abstract dashLine: string;
    abstract toJSON: () => never;
    abstract toMinimalJSON: () => never;
    abstract move: () => never;
    abstract getOperators: OperationHandlers[];
    abstract isInsideRect: () => boolean;
}
export default RectangleLikeAbstract;
