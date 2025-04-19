import Base, { BasicModuleProps } from "../base.ts";
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
