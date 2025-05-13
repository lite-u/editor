import RectangleLike, { RectangleLikeProps } from '../rectangle/rectangleLike';
import { Fill, Stroke, TextFontProps, TextRun } from '~/elements/props';
export interface TextProps extends RectangleLikeProps {
    type?: 'text';
    content: TextRun[];
    font?: TextFontProps;
    fill?: Fill;
    stroke: Stroke;
    verticalAlign: 'left' | 'center' | 'right';
    horizontalAlign: 'top' | 'middle' | 'bottom';
}
export type RequiredTextProps = Required<TextProps>;
declare class ElementText extends RectangleLike {
    readonly type = "text";
    content: TextRun[];
    font?: TextFontProps;
    fill?: Fill;
    stroke: Stroke;
    verticalAlign: 'left' | 'center' | 'right';
    horizontalAlign: 'top' | 'middle' | 'bottom';
    constructor({ content, text, font, ...rest }: TextProps);
    toJSON(): RequiredTextProps;
    toMinimalJSON(): TextProps;
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementText;
