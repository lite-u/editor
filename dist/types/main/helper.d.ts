import { ElementInstance } from '~/type';
import ElementRectangle from '~/elements/rectangle/rectangle';
import Editor from '~/main/editor';
export declare function generateTransformHandles(ele: ElementRectangle, ratio: number, specialLineSeg?: boolean): ElementInstance[];
export declare function getSelectedBoundingElement(this: Editor): ElementRectangle | undefined;
export declare function generateElementsClones(this: Editor): void;
