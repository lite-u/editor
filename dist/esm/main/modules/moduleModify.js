import Rectangle from '../../core/modules/shapes/rectangle.ts';
import Ellipse from '../../core/modules/shapes/ellipse.ts';
import deepClone from '../../lib/deepClone.ts';
export function batchCreate(moduleDataList) {
    const clonedData = deepClone(moduleDataList);
    const newMap = new Map();
    let localMaxLayer = 0;
    const create = (data) => {
        if (!data.id) {
            data.id = this.createModuleId;
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
    };
    clonedData.forEach(data => {
        const module = create.call(this, data);
        newMap.set(data.id, module);
    });
    return newMap;
}
export function batchAdd(modules) {
    modules.forEach(mod => {
        this.moduleMap.set(mod.id, mod);
    });
    // this.events.onModulesUpdated?.(this.moduleMap)
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
    return moduleArr.map(mod => mod.getDetails(includeIdentifiers));
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
        module.x += delta.x;
        module.y += delta.y;
    });
}
export function batchModify(idSet, data) {
    const modulesMap = this.getModulesByIdSet(idSet);
    modulesMap.forEach((module) => {
        Object.keys(data).forEach((key) => {
            const keyName = key;
            module[keyName] = data[key];
        });
    });
}
