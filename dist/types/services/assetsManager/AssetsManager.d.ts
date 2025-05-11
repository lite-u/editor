import { VisionEditorAssetType } from '~/services/assetsManager/asssetsManager';
declare class AssetsManager {
    assetsMap: Map<string, VisionEditorAssetType>;
    constructor(assets?: VisionEditorAssetType[]);
    getAssetsObj(id: string): VisionEditorAssetType | false;
    add(asset: VisionEditorAssetType): void;
    destroy(): void;
}
export default AssetsManager;
