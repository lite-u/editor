import Base, { BasicModuleProps } from '~/elements/base';
import { Gradient, HexColor, UID } from '~/core/core';
import { BoundingRect, Size } from '~/type';
export interface ConnectorProps extends BasicModuleProps {
    start?: UID;
    end?: UID;
    gradient?: Gradient;
    enableGradient?: boolean;
    fillColor?: HexColor;
    enableFill?: boolean;
}
declare class Connector extends Base {
    readonly start: UID;
    readonly end: UID;
    constructor({ start, end, ...rest }: ConnectorProps);
    getDetails(): ConnectorProps;
    getSize(): Size;
    getBoundingRect(): BoundingRect;
}
export default Connector;
