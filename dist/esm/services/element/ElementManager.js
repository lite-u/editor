import deepClone from '../../core/deepClone.js';
import nid from '../../core/nid.js';
import ElementRectangle from '../../elements/rectangle/rectangle.js';
import ElementEllipse from '../../elements/ellipse/ellipse.js';
import ElementText from '../../elements/text/text.js';
import ElementImage from '../../elements/image/image.js';
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
        return false;
    }
    batchCreate(moduleDataList) {
        const clonedData = deepClone(moduleDataList);
        const newMap = new Map();
        // let localMaxLayer = 0
        /*    if (isNaN(data.layer)) {
              const maxFromelementMap = this.getMaxLayerIndex
    
              localMaxLayer = Math.max(localMaxLayer, maxFromelementMap)
              localMaxLayer++
    
              data.layer = localMaxLayer
            }*/
        clonedData.forEach(data => {
            const module = this.create(data);
            if (module) {
                newMap.set(data.id, module);
            }
        });
        return newMap;
    }
    add(element) {
        this.elementMap.set(element.id, element);
        return element;
    }
    batchAdd(modules, callback) {
        modules.forEach(mod => {
            this.add(mod);
        });
        callback && callback();
        //       this.assetsManager.add('image', data.src)
        // this.events.onModulesUpdated?.(this.elementMap)
        /* if (callback) {
           const pArr = []
           modules.forEach(mod => {
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
        return modules;
    }
    batchCopy(idSet, includeIdentifiers = true) {
        // const modulesMap: ElementMap = new Map()
        const elementArr = [];
        idSet.forEach(id => {
            const mod = this.elementMap.get(id);
            if (mod) {
                elementArr.push(mod);
                // modulesMap.set(id, mod)
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
        backup.forEach(module => {
            this.elementMap.delete(module.id);
        });
        // this.events.onModulesUpdated?.(this.elementMap)
        return backup;
    }
    batchMove(from, delta) {
        const modulesMap = this.getElementMapByIdSet(from);
        modulesMap.forEach((module) => {
            module.cx += delta.x;
            module.cy += delta.y;
        });
    }
    batchModify(idSet, data) {
        const modulesMap = this.getElementMapByIdSet(idSet);
        modulesMap.forEach((module) => {
            Object.keys(data).forEach((key) => {
                const keyName = key;
                // @ts-ignore
                module[keyName] = data[key];
            });
        });
    }
    destroy() {
        this.elementMap.clear();
    }
}
export default ElementManager;
