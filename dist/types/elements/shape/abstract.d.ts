import Base from '../base/base';
import { OperationHandlers } from '~/engine/selection/type';
import { ElementFillColor } from '~/core/core';
declare abstract class RectangleLike extends Base {
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
export default RectangleLike;
