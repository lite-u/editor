import { EditorEventData, EditorEventType } from './type';
export type EventsCallback<K extends EditorEventType> = EditorEventData<K> extends never ? () => void : (data: EditorEventData<K>) => void;
declare class Action {
    private readonly eventsMap;
    constructor();
    on<K extends EditorEventType>(eventName: K, callback: EventsCallback<K>): void;
    off<K extends EditorEventType>(eventName: K, callback: EventsCallback<K>): "deleted" | "Cannot find event or function" | undefined;
    dispatch<K extends EditorEventType>(type: K, data?: EditorEventData<K>): void;
    execute<K extends EditorEventType>(type: K, data: EditorEventData<K>): void;
    destroy(): void;
}
export default Action;
