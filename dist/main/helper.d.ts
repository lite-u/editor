import ElementRectangle from '~/elements/rectangle/rectangle';
import Editor from '~/main/editor';
export declare function generateElementsDetectArea(this: Editor): void;
export declare function generateSelectedBoundingElement(this: Editor): ElementRectangle;
export declare function generateTransformHandles(this: Editor, ele: ElementRectangle, specialLineSeg?: boolean): ElementInstance[];
export declare function generateAnchorAndPath(this: Editor): void;
