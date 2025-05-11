import { VisionEventData, VisionEventType } from './type';
export type EventsCallback<K extends VisionEventType> = VisionEventData<K> extends never ? () => void : (data: VisionEventData<K>) => void;
declare class Action {
    private readonly eventsMap;
    constructor();
    on<K extends VisionEventType>(eventName: K, callback: EventsCallback<K>): void;
    off<K extends VisionEventType>(eventName: K, callback: EventsCallback<K>): "deleted" | "Cannot find event or function" | undefined;
    dispatch<K extends VisionEventType>(type: K, data?: VisionEventData<K>): void;
    execute<K extends VisionEventType>(type: K, data: VisionEventData<K>): void;
    destroy(): void;
}
export default Action;
