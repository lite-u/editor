type Point = {
    x: number;
    y: number;
};
export declare class BasePath {
    protected getPoints(): Point[];
    getCenter(): Point;
}
export {};
