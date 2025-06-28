"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AssetsManager {
    constructor(editor, assets = []) {
        this.assetsMap = new Map();
        this.editor = editor;
        assets.forEach(asset => this.add(asset));
    }
    getAssetsObj(id) {
        return this.assetsMap.get(id) || false;
    }
    add(asset) {
        this.assetsMap.set(asset.id, asset);
    }
    /*  static async resolve(file: File): Promise<AssetsObj> {
        return new Promise<AssetsObj>(async (resolve, reject) => {
  
          if (!file) {
            reject('File error')
          }
  
          if (!file!.type.startsWith('image/')) {
            reject('File format error')
          }
  
          const imageRef = await waitImageSize(file)
  
          resolve({
            id: nid(),
            type: 'image',
            file,
            imageRef,
            name: file.name,
          })
  
        })
      }*/
    destroy() {
        this.assetsMap.forEach((asset) => {
            // do sth
            if (asset.type === 'image') {
                URL.revokeObjectURL(asset.imageRef.src);
            }
        });
    }
}
exports.default = AssetsManager;
