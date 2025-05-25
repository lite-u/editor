import { ElementInstance } from '~/type';
import Editor from '~/main/editor';
export declare const getManipulationBox: (rect: {
    cx: number;
    cy: number;
    width: number;
    height: number;
}, rotation: number, ratio: number, specialLineSeg: boolean | undefined, handleRotate: VoidFunction, handleResize: VoidFunction) => ElementInstance[];
export declare function regenerateOverlayElements(this: Editor): void;
