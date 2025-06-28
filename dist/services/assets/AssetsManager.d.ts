import { VisionEditorAssetType } from '~/services/assets/asssetsManager';
import Editor from '~/main/editor';
declare class AssetsManager {
    assetsMap: Map<string, VisionEditorAssetType>;
    editor: Editor;
    constructor(editor: Editor, assets?: VisionEditorAssetType[]);
    getAssetsObj(id: string): VisionEditorAssetType | false;
    add(asset: VisionEditorAssetType): void;
    destroy(): void;
}
export default AssetsManager;
