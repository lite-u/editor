// import {generateHandles} from '~/elements/helper'
class VisibleManager {
    visibleElementMap;
    visibleSelected = new Set();
    editor;
    constructor(editor) {
        this.editor = editor;
        this.visibleElementMap = new Map();
    }
    get values() {
        return [...this.visibleElementMap.values()];
    }
    getElementsAtPoint() { }
    get getVisibleElementMap() {
        return new Map(this.visibleElementMap);
    }
    get getVisibleSelected() {
        return new Set(this.visibleSelected);
    }
    get getVisibleSelectedElements() {
        return this.editor.mainHost.getElementsByIdSet(this.getVisibleSelected);
    }
    /*
      updateVisibleElementMap() {
        this.visibleElementMap.clear()
        // console.log(this.viewport.offset, this.viewport.worldRect)
        // Create an array from the Map, sort by the 'layer' property, and then add them to visibleelementMap
        const sortedElements = (this.editor.mainHost.values)
          .filter(element => {
            const boundingRect = element.getBoundingRect() as BoundingRect
            return rectsOverlap(boundingRect, this.editor.world.worldRect)
          })
          .sort((a, b) => a.layer - b.layer)
        // console.log(this.editor.elementManager.all)
        sortedElements.forEach(element => {
          this.visibleElementMap.set(element.id, element)
        })
      }*/
    /*
    
      updateVisibleSelected() {
        this.visibleSelected.clear()
        this.editor.interaction.operationHandlers.length = 0
    
        this.getVisibleElementMap.forEach((element) => {
          if (this.editor.selection.has(element.id)) {
            this.visibleSelected.add(element.id)
          }
        })
    
        const elementProps = this.editor.selection.pickIfUnique
    
        if (elementProps) {
          // const element = this.editor.elementManager.getElementById(elementProps.id)
          // const {scale, dpr} = this.editor.world
          // const ratio = scale * dpr
    
          return
          // const operators = generateHandles(element, ratio)
          /!* const operators = element.getOperators(
             element!.id,
             {
               size: resizeSize,
               lineColor,
               lineWidth,
               fillColor: '#fff',
             }, {
               size: rotateSize,
               lineColor: 'transparent',
               lineWidth: 0,
               fillColor: 'transparent',
             })*!/
    
          // console.log(...operators)
          // this.editor.interaction.operationHandlers.push(...operators)
        }
      }
    */
    destroy() {
        this.visibleElementMap.clear();
        this.visibleSelected.clear();
        this.editor = null;
        this.visibleElementMap = null;
        this.visibleSelected = null;
    }
}
export default VisibleManager;
