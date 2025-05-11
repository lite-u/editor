import Base from '../base.js';
class Connector extends Base {
    start;
    end;
    constructor({ start, end, ...rest }) {
        super(rest);
        this.start = start;
        this.end = end;
        // this.width = width!;
        // this.height = height!;
    }
    getDetails() {
        return {
            ...this.getSize(),
            ...super.getDetails(),
        };
    }
    getSize() {
        return {
            width: 100,
            height: 100,
        };
    }
    getBoundingRect() {
        const { x, y, } = { x: 0, y: 1 };
        const { width, height, } = this.getSize();
        return {
            x,
            y,
            width,
            height,
            top: y,
            left: x,
            right: x + width,
            bottom: y + height,
        };
    }
}
export default Connector;
