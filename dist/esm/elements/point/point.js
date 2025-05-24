class Point {
    type = 'point';
    id;
    x;
    y;
    constructor({ id, x, y }) {
        this.x = x;
        this.y = y;
    }
    translate(x, y) {
        this.x += x;
        this.y += y;
    }
    render(ctx) {
    }
    getJSON() {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
        };
    }
    getMinimalJSON() { }
}
export {};
