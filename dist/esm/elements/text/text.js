import RectangleLike from '../rectangle/rectangleLike.js';
import render from './render.js';
const TEXT_COLOR = '#000000';
const CONTENT = `
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi 
`;
const DEFAULT_FONT = 'sans-serif';
const DEFAULT_FONT_SIZE = 12;
const DEFAULT_ALIGNMENT = 'left';
const DEFAULT_FONT_WEIGHT = 400;
const DEFAULT_ITALICS = false;
const DEFAULT_UNDERLINES = false;
const DEFAULT_THROUGH_LINE = false;
const DEFAULT_LINE_HEIGHT = 1.2;
class ElementText extends RectangleLike {
    type = 'text';
    textColor;
    content;
    font;
    fontSize;
    alignment;
    fontWeight;
    italics;
    underlines;
    throughLine;
    lineHeight;
    constructor({ textColor = TEXT_COLOR, content = CONTENT, font = DEFAULT_FONT, fontSize = DEFAULT_FONT_SIZE, alignment = DEFAULT_ALIGNMENT, fontWeight = DEFAULT_FONT_WEIGHT, italics = DEFAULT_ITALICS, underlines = DEFAULT_UNDERLINES, throughLine = DEFAULT_THROUGH_LINE, lineHeight = DEFAULT_LINE_HEIGHT, ...rest }) {
        super({ ...rest });
        this.textColor = textColor;
        this.content = content;
        this.font = font;
        this.fontSize = fontSize;
        this.alignment = alignment;
        this.fontWeight = fontWeight;
        this.italics = italics;
        this.underlines = underlines;
        this.throughLine = throughLine;
        this.lineHeight = lineHeight;
    }
    toJSON() {
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
        };
    }
    toMinimalJSON() {
        const result = {
            ...super.toMinimalJSON(),
            type: this.type,
            content: this.content,
            textColor: this.textColor,
        };
        if (this.textColor !== TEXT_COLOR) {
            result.textColor = this.textColor;
        }
        if (this.content !== CONTENT) {
            result.content = this.content;
        }
        if (this.font !== DEFAULT_FONT) {
            result.font = this.font;
        }
        if (this.fontSize !== DEFAULT_FONT_SIZE) {
            result.fontSize = this.fontSize;
        }
        if (this.alignment !== DEFAULT_ALIGNMENT) {
            result.alignment = this.alignment;
        }
        if (this.fontWeight !== DEFAULT_FONT_WEIGHT) {
            result.fontWeight = this.fontWeight;
        }
        if (this.italics !== DEFAULT_ITALICS) {
            result.italics = this.italics;
        }
        if (this.underlines !== DEFAULT_UNDERLINES) {
            result.underlines = this.underlines;
        }
        if (this.throughLine !== DEFAULT_THROUGH_LINE) {
            result.throughLine = this.throughLine;
        }
        if (this.lineHeight !== DEFAULT_LINE_HEIGHT) {
            result.lineHeight = this.lineHeight;
        }
        return result;
    }
    /*  public getOperators(
        resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
        rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
      ) {
  
        return super.getOperators(resizeConfig, rotateConfig, this.getRect(), this.toMinimalJSON(true))
      }*/
    render(ctx) {
        super.render(ctx);
        render.call(this, ctx);
    }
}
export default ElementText;
