import RectangleLike, {RectangleLikeProps} from '../rectangle/rectangleLike'
import render from './render'
import {Fill, Stroke, TextFontProps, TextRun} from '~/elements/props'
import deepClone from '~/core/deepClone'


const TEXT_COLOR = '#000000'
const CONTENT = `
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi 
`
const DEFAULT_FONT = 'sans-serif'
const DEFAULT_FONT_SIZE = 12
const DEFAULT_ALIGNMENT: Alignment = 'left'
const DEFAULT_FONT_WEIGHT = 400
const DEFAULT_ITALICS = false
const DEFAULT_UNDERLINES = false
const DEFAULT_THROUGH_LINE = false
const DEFAULT_LINE_HEIGHT = 1.2
type Alignment = 'left' | 'center' | 'right';


export interface TextProps extends RectangleLikeProps {
  type?: 'text'
  content: TextRun[];  // Array of styled fragments
  font?: TextFontProps;
  fill?: Fill;
  stroke: Stroke
  verticalAlign: 'left' | 'center' | 'right';
  horizontalAlign: 'top' | 'middle' | 'bottom';
}

export type RequiredTextProps = Required<TextProps>

class ElementText extends RectangleLike {
  readonly type = 'text'
  content: TextRun[];
  font?: TextFontProps;
  fill?: Fill;
  stroke: Stroke
  verticalAlign: 'left' | 'center' | 'right';
  horizontalAlign: 'top' | 'middle' | 'bottom';

  constructor({
                content = [],
                text = CONTENT,
                font = deepClone(DEFAULT_FONT),

                ...rest
              }: TextProps) {
    super({...rest})
    this.textColor = textColor
    this.content = content
    this.font = font
    this.fontSize = fontSize
    this.alignment = alignment
    this.fontWeight = fontWeight
    this.italics = italics
    this.underlines = underlines
    this.throughLine = throughLine
    this.lineHeight = lineHeight
  }

  override toJSON(): RequiredTextProps {
    return {
      ...super.toJSON(),
      type: this.type,
      content: this.content,
      textColor: this.textColor,
      font: this.font,
      fontSize: this.fontSize,
      alignment: this.alignment,
      fontWeight: this.fontWeight,
      italics: this.italics,
      underlines: this.underlines,
      throughLine: this.throughLine,
      lineHeight: this.lineHeight,
    }
  }

  public toMinimalJSON(): TextProps {
    const result: TextProps = {
      ...super.toMinimalJSON(),
      type: this.type,
      content: this.content,
      textColor: this.textColor,
    }

    if (this.textColor !== TEXT_COLOR) {
      result.textColor = this.textColor
    }

    if (this.content !== CONTENT) {
      result.content = this.content
    }

    if (this.font !== DEFAULT_FONT) {
      result.font = this.font
    }

    if (this.fontSize !== DEFAULT_FONT_SIZE) {
      result.fontSize = this.fontSize
    }

    if (this.alignment !== DEFAULT_ALIGNMENT) {
      result.alignment = this.alignment
    }

    if (this.fontWeight !== DEFAULT_FONT_WEIGHT) {
      result.fontWeight = this.fontWeight
    }

    if (this.italics !== DEFAULT_ITALICS) {
      result.italics = this.italics
    }

    if (this.underlines !== DEFAULT_UNDERLINES) {
      result.underlines = this.underlines
    }

    if (this.throughLine !== DEFAULT_THROUGH_LINE) {
      result.throughLine = this.throughLine
    }

    if (this.lineHeight !== DEFAULT_LINE_HEIGHT) {
      result.lineHeight = this.lineHeight
    }

    return result
  }

  /*  public getOperators(
      resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
      rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    ) {

      return super.getOperators(resizeConfig, rotateConfig, this.getRect(), this.toMinimalJSON(true))
    }*/

  render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx)
    render.call(this, ctx)
  }
}

export default ElementText