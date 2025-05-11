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
export type RequiredTextProps = Required<TextProps>;
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
    toJSON(): RequiredTextProps;
    toMinimalJSON(): {
        content: string;
        textColor: string;
        type?: "rectangle";
        id: string;
        layer: number;
        width: number;
        height: number;
        radius: number;
        cx: number;
        cy: number;
        enableGradient: boolean;
        gradient: string;
        enableFill: boolean;
        fillColor: import("../../type").ElementFillColor;
        dashLine: string;
        enableLine: boolean;
        lineColor: CanvasRenderingContext2D["strokeStyle"];
        lineWidth: CanvasRenderingContext2D["lineWidth"];
        opacity: CanvasRenderingContext2D["globalAlpha"];
        enableShadow: boolean;
        shadow: string;
        rotation: number;
    };
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementText;
