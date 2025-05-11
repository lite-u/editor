import { ElementFillColor } from '~/core/core';
declare abstract class RectangleLikeAbstract {
    abstract type: string;
    abstract cx: number;
    abstract cy: number;
    abstract fillColor: ElementFillColor;
    abstract enableFill: boolean;
    abstract enableGradient: boolean;
    abstract gradient: string;
    abstract dashLine: string;
}
export default RectangleLikeAbstract;
