import { ElementInstance } from '~/type';
import Editor from '~/main/editor';
export declare function generateTransformHandles(rect: {
    cx: number;
    cy: number;
    width: number;
    height: number;
}, ratio: number, rotation: number, specialLineSeg?: boolean): ElementInstance[];
export declare function getManipulationBox(this: Editor): void;
export declare function regenerateOverlayElements(this: Editor): void;
