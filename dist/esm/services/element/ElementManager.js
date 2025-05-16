import deepClone from '../../core/deepClone.js';
import nid from '../../core/nid.js';
import ElementRectangle from '../../elements/rectangle/rectangle.js';
import ElementEllipse from '../../elements/ellipse/ellipse.js';
import ElementText from '../../elements/text/text.js';
import ElementImage from '../../elements/image/image.js';
import ElementLineSegment from '../../elements/lines/lineSegment.js';
import ElementPath from '../../elements/path/path.js';
class ElementManager {
    elementMap = new Map();
    editor;
    constructor(editor) {
        this.editor = editor;
    }
    has(id) {
        return this.elementMap.has(id);
    }
    get size() {
        return this.elementMap.size;
    }
    get keys() {
        const set = new Set();
        this.elementMap.forEach((element) => {
            set.add(element.id);
        });
        return set;
    }
    get values() {
        return [...this.elementMap.values()];
    }
    get all() {
        return new Map(this.elementMap);
    }
    get getMaxLayerIndex() {
        let max = 0;
        this.elementMap.forEach((mod) => {
            // console.log(mod.layer)
            if (mod.layer > max) {
                max = mod.layer;
            }
        });
        return max;
    }
    getElementById(id) {
        return this.elementMap.get(id);
    }
    getElementsByIdSet(idSet) {
        const result = new Map();
        idSet.forEach(id => {
            const mod = this.elementMap.get(id);
            if (mod) {
                result.set(id, mod);
            }
        });
        return result;
    }
    getElementMapByIdSet(idSet) {
        const result = new Map();
        idSet.forEach((id) => {
            const mod = this.elementMap.get(id);
            if (mod) {
                result.set(id, mod);
            }
        });
        return result;
    }
    create(data) {
        if (!data || !data.type) {
            console.error('Data or Type missed');
            return false;
        }
        if (!data.id) {
            let id = data.type + '-' + nid();
            // ensure short id no repeat
            if (this.elementMap.has(id)) {
                id = nid();
            }
            data.id = id;
        }
        if (isNaN(data.layer)) {
            const maxLayer = this.getMaxLayerIndex;
            data.layer = maxLayer + 1;
        }
        if (data.type === 'rectangle') {
            return new ElementRectangle(data);
        }
        if (data.type === 'ellipse') {
            return new ElementEllipse(data);
        }
        if (data.type === 'text') {
            return new ElementText(data);
        }
        if (data.type === 'image') {
            return new ElementImage(data);
        }
        if (data.type === 'lineSegment') {
            return new ElementLineSegment(data);
        }
        if (data.type === 'path') {
            return new ElementPath(data);
        }
        return false;
    }
    batchCreate(elementDataList) {
        const clonedData = deepClone(elementDataList);
        const newMap = new Map();
        // let localMaxLayer = 0
        /*    if (isNaN(data.layer)) {
              const maxFromelementMap = this.getMaxLayerIndex
    
              localMaxLayer = Math.max(localMaxLayer, maxFromelementMap)
              localMaxLayer++
    
              data.layer = localMaxLayer
            }*/
        clonedData.forEach(data => {
            const element = this.create(data);
            if (element) {
                newMap.set(data.id, element);
            }
        });
        return newMap;
    }
    add(element) {
        this.elementMap.set(element.id, element);
        return element;
    }
    batchAdd(elements, callback) {
        elements.forEach(mod => {
            this.add(mod);
        });
        callback && callback();
        //       this.assetsManager.add('image', data.src)
        // this.events.onElementsUpdated?.(this.elementMap)
        /* if (callback) {
           const pArr = []
           elements.forEach(mod => {
             if (mod.type === 'image') {
               const {src} = mod as ElementImage
    
               if (src && !this.assetsManager.getAssetsObj(src)) {
                 // @ts-ignore
                 pArr.push(this.assetsManager.add('image', src))
               }
             }
           })
    
           // @ts-ignore
           Promise.all(pArr).then((objs: VisionEditorAssetType[]) => objs).finally((objs) => {
             callback(objs)
           })
         }*/
        return elements;
    }
    batchCopy(idSet, includeIdentifiers = true) {
        // const elementsMap: ElementMap = new Map()
        const elementArr = [];
        idSet.forEach(id => {
            const mod = this.elementMap.get(id);
            if (mod) {
                elementArr.push(mod);
                // elementsMap.set(id, mod)
            }
        });
        elementArr.sort((a, b) => a.layer - b.layer);
        return elementArr.map(mod => {
            let { id, ...rest } = mod.toMinimalJSON();
            if (includeIdentifiers) {
                return { id, ...rest };
            }
            return rest;
        });
    }
    batchDelete(idSet) {
        const backup = this.batchCopy(idSet);
        backup.forEach(element => {
            this.elementMap.delete(element.id);
        });
        // this.events.onElementsUpdated?.(this.elementMap)
        return backup;
    }
    batchMove(from, delta) {
        const elementsMap = this.getElementMapByIdSet(from);
        elementsMap.forEach((element) => {
            element.cx += delta.x;
            element.cy += delta.y;
        });
    }
    batchModify(idSet, data) {
        const elementsMap = this.getElementMapByIdSet(idSet);
        elementsMap.forEach((element) => {
            Object.keys(data).forEach((key) => {
                const keyName = key;
                // @ts-ignore
                element[keyName] = data[key];
            });
        });
    }
    destroy() {
        this.elementMap.clear();
    }
}
export default ElementManager;
