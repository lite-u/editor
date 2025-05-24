import RectangleLike, { RectangleLikeProps } from '../rectangle/rectangleLike';
import { HorizontalAlign, TextFontProps, TextRun, VerticalAlign } from '~/elements/props';
export interface TextProps extends RectangleLikeProps {
    type?: 'text';
    content: TextRun[];
    font?: TextFontProps;
    verticalAlign?: VerticalAlign;
    horizontalAlign?: HorizontalAlign;
}
export type RequiredTextProps = Required<TextProps>;
declare class ElementText extends RectangleLike {
    readonly type = "text";
    content: TextRun[];
    font: TextFontProps;
    verticalAlign: VerticalAlign;
    horizontalAlign: HorizontalAlign;
    constructor({ content, font, verticalAlign, horizontalAlign, ...rest }: TextProps);
    toJSON(): RequiredTextProps;
    toMinimalJSON(): TextProps;
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementText;
