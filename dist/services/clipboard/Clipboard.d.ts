import { ElementProps } from '~/elements/type';
declare class ClipboardManager {
    copiedItems: ElementProps[];
    CopyDeltaX: number;
    CopyDeltaY: number;
    copy(): void;
    paste(): void;
    updateCopiedItemsDelta(): void;
    destroy(): void;
}
export default ClipboardManager;
