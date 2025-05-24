import RectangleLike from '../rectangle/rectangleLike.js';
import render from './render.js';
import deepClone from '../../core/deepClone.js';
import { DEFAULT_FONT, DEFAULT_HORIZONTAL_ALIGN, DEFAULT_TEXT_FILL, DEFAULT_TEXT_FONT, DEFAULT_VERTICAL_ALIGN, } from '../defaultProps.js';
import { isEqual } from '../../lib/lib.js';
class ElementText extends RectangleLike {
    type = 'text';
    content;
    font;
    verticalAlign;
    horizontalAlign;
    constructor({ content = [], font = deepClone(DEFAULT_TEXT_FONT), verticalAlign = DEFAULT_VERTICAL_ALIGN, horizontalAlign = DEFAULT_HORIZONTAL_ALIGN, ...rest }) {
        super({ ...rest });
        this.content = content;
        this.font = font;
        this.verticalAlign = verticalAlign;
        this.horizontalAlign = horizontalAlign;
        this.fill = deepClone(DEFAULT_TEXT_FILL);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type,
            content: deepClone(this.content),
            font: deepClone(this.font),
            verticalAlign: this.verticalAlign,
            horizontalAlign: this.horizontalAlign,
        };
    }
    toMinimalJSON() {
        const result = {
            ...super.toMinimalJSON(),
            type: this.type,
            content: deepClone(this.content),
            font: deepClone(this.font),
            verticalAlign: this.verticalAlign,
            horizontalAlign: this.horizontalAlign,
        };
        if (this.verticalAlign !== DEFAULT_VERTICAL_ALIGN) {
            result.verticalAlign = this.verticalAlign;
        }
        if (this.horizontalAlign !== DEFAULT_HORIZONTAL_ALIGN) {
            result.horizontalAlign = this.horizontalAlign;
        }
        if (!isEqual(this.font, DEFAULT_FONT)) {
            result.horizontalAlign = this.horizontalAlign;
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
