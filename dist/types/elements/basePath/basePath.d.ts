type Point = {
    x: number;
    y: number;
};
export declare class BasePath {
    protected get getPoints(): Point[];
    getCenter(): Point;
}
export {};
