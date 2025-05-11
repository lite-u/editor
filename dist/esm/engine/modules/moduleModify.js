import Rectangle from '../../elements/rectangle/rectangle.js';
import Ellipse from '../../elements/ellipse/ellipse.js';
import ElementText from '../../elements/text/text.js';
import ElementImage from '../../elements/image/image.js';
import nid from '../../core/nid.js';
import deepClone from '../../core/deepClone.js';
export function batchCreate(moduleDataList) {
    const clonedData = deepClone(moduleDataList);
    const newMap = new Map();
    let localMaxLayer = 0;
    const create = (data) => {
        if (!data.id) {
            let id = nid();
            // ensure short id no repeat
            if (this.moduleMap.has(id)) {
                id = nid();
            }
            data.id = id;
        }
        if (isNaN(data.layer)) {
            const maxFromModuleMap = this.getMaxLayerIndex;
            localMaxLayer = Math.max(localMaxLayer, maxFromModuleMap);
            localMaxLayer++;
            data.layer = localMaxLayer;
        }
        if (data.type === 'rectangle') {
            return new Rectangle(data);
        }
        if (data.type === 'ellipse') {
            return new Ellipse(data);
        }
        if (data.type === 'text') {
            // console.log(data)
            return new ElementText(data);
        }
        if (data.type === 'image') {
            return new ElementImage(data);
        }
    };
    clonedData.forEach(data => {
        const module = create.call(this, data);
        newMap.set(data.id, module);
    });
    return newMap;
}
export function batchAdd(modules, callback) {
    modules.forEach(mod => {
        this.moduleMap.set(mod.id, mod);
    });
    //       this.assetsManager.add('image', data.src)
    // this.events.onModulesUpdated?.(this.moduleMap)
    if (callback) {
        const pArr = [];
        modules.forEach(mod => {
            if (mod.type === 'image') {
                const { src } = mod;
                if (src && !this.assetsManager.getAssetsObj(src)) {
                    // @ts-ignore
                    pArr.push(this.assetsManager.add('image', src));
                }
            }
        });
        // @ts-ignore
        Promise.all(pArr).then((objs) => objs).finally((objs) => {
            callback(objs);
        });
    }
    return modules;
}
export const batchCopy = function (idSet, includeIdentifiers) {
    const modulesMap = new Map();
    const moduleArr = [];
    idSet.forEach(id => {
        const mod = this.moduleMap.get(id);
        if (mod) {
            moduleArr.push(mod);
            modulesMap.set(id, mod);
        }
    });
    moduleArr.sort((a, b) => a.layer - b.layer);
    return moduleArr.map(mod => mod.toMinimalJSON(includeIdentifiers));
};
export function batchDelete(idSet) {
    const backup = this.batchCopy(idSet);
    backup.forEach(module => {
        this.moduleMap.delete(module.id);
    });
    // this.events.onModulesUpdated?.(this.moduleMap)
    return backup;
}
export function batchMove(from, delta) {
    const modulesMap = this.getModulesByIdSet(from);
    modulesMap.forEach((module) => {
        module.cx += delta.x;
        module.cy += delta.y;
    });
}
export function batchModify(idSet, data) {
    const modulesMap = this.getModulesByIdSet(idSet);
    modulesMap.forEach((module) => {
        Object.keys(data).forEach((key) => {
            const keyName = key;
            // @ts-ignore
            module[keyName] = data[key];
        });
    });
}
