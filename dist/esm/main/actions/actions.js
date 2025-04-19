class Action {
    eventsMap = new Map();
    constructor() { }
    // subscribe
    on(eventName, callback) {
        if (this.eventsMap.has(eventName)) {
            this.eventsMap
                .get(eventName)
                .push(callback);
        }
        else {
            this.eventsMap.set(eventName, [
                callback,
            ]);
        }
    }
    // unsubscribe
    off(eventName, callback) {
        if (this.eventsMap.has(eventName)) {
            const arr = this.eventsMap.get(eventName);
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i] === callback) {
                    arr.splice(i, 1);
                    return 'deleted';
                }
            }
            return 'Cannot find event or function';
        }
    }
    dispatch(type, data) {
        // console.info('action: ', type,data)
        // console.info('action: ', type)
        if (this.eventsMap.has(type)) {
            this.eventsMap.get(type).forEach((cb) => {
                cb(data);
            });
        }
    }
    execute(type, data) {
        this.dispatch(type, data);
        // console.log(type,data)
    }
    destroy() {
        this.eventsMap.clear();
    }
}
export default Action;
//# sourceMappingURL=actions.js.map