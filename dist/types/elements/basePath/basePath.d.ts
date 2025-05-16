type Point = {
    x: number;
    y: number;
};
export declare class BasePath {
    protected matrix: DOMMatrix;
    protected get getPoints(): Point[];
    getCenter(): Point;
}
export {};
