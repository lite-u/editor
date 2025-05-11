import Rectangle, { RectangleProps } from '../rectangle/rectangle';
export interface TextProps extends RectangleProps {
    type: 'text';
    textColor: string;
    content: string;
    font: string;
    fontSize: number;
    alignment: string;
    bold: boolean;
    italics: boolean;
    underlines: boolean;
    throughLine: boolean;
    lineHeight: number;
}
declare class ElementText extends Rectangle {
    textColor: string;
    content: string;
    font: string;
    fontSize: number;
    alignment: string;
    bold: boolean;
    italics: boolean;
    underlines: boolean;
    throughLine: boolean;
    lineHeight: number;
    constructor({ textColor, content, font, fontSize, alignment, bold, italics, underlines, throughLine, lineHeight, ...rest }: Omit<TextProps, 'type'>);
    getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>;
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
    }): import("../../engine/selection/type").OperationHandlers[];
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementText;
