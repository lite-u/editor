"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchCopy = void 0;
exports.batchCreate = batchCreate;
exports.batchAdd = batchAdd;
exports.batchDelete = batchDelete;
exports.batchMove = batchMove;
exports.batchModify = batchModify;
const rectangle_ts_1 = __importDefault(require("../../core/modules/shapes/rectangle.ts"));
const ellipse_ts_1 = __importDefault(require("../../core/modules/shapes/ellipse.ts"));
const deepClone_ts_1 = __importDefault(require("../../lib/deepClone.ts"));
function batchCreate(moduleDataList) {
    const clonedData = (0, deepClone_ts_1.default)(moduleDataList);
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
            return new rectangle_ts_1.default(data);
        }
        if (data.type === 'ellipse') {
            return new ellipse_ts_1.default(data);
        }
    };
    clonedData.forEach(data => {
        const module = create.call(this, data);
        newMap.set(data.id, module);
    });
    return newMap;
}
function batchAdd(modules) {
    modules.forEach(mod => {
        this.moduleMap.set(mod.id, mod);
    });
    // this.events.onModulesUpdated?.(this.moduleMap)
    return modules;
}
const batchCopy = function (idSet, includeIdentifiers) {
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
exports.batchCopy = batchCopy;
function batchDelete(idSet) {
    const backup = this.batchCopy(idSet);
    backup.forEach(module => {
        this.moduleMap.delete(module.id);
    });
    // this.events.onModulesUpdated?.(this.moduleMap)
    return backup;
}
function batchMove(from, delta) {
    const modulesMap = this.getModulesByIdSet(from);
    modulesMap.forEach((module) => {
        module.x += delta.x;
        module.y += delta.y;
    });
}
function batchModify(idSet, data) {
    const modulesMap = this.getModulesByIdSet(idSet);
    modulesMap.forEach((module) => {
        Object.keys(data).forEach((key) => {
            const keyName = key;
            module[keyName] = data[key];
        });
    });
}
