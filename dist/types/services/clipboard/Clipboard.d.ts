import { UID } from '~/core/core';
declare class Clipboard {
    copiedItems: Set<UID>;
    copy(): void;
    paste(): void;
}
export default Clipboard;
