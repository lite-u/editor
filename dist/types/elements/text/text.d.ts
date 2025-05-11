import RectangleLike, { RectangleLikeProps } from '../rectangle/rectangleLike';
export interface TextProps extends RectangleLikeProps {
    type?: 'text';
    textColor?: string;
    content?: string;
    font?: string;
    fontSize?: number;
    alignment?: string;
    fontWeight?: number;
    italics?: boolean;
    underlines?: boolean;
    throughLine?: boolean;
    lineHeight?: number;
}
export type RequiredTextProps = Required<TextProps>;
declare class ElementText extends RectangleLike {
    readonly type = "text";
    textColor: string;
    content: string;
    font: string;
    fontSize: number;
    alignment: string;
    fontWeight: number;
    italics: boolean;
    underlines: boolean;
    throughLine: boolean;
    lineHeight: number;
    constructor({ textColor, content, font, fontSize, alignment, fontWeight, italics, underlines, throughLine, lineHeight, ...rest }: TextProps);
    toJSON(): RequiredTextProps;
    toMinimalJSON(): TextProps;
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementText;
