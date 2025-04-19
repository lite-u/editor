interface CloneOptions {
    clonePrototype?: boolean;
}
declare function deepClone<T>(obj: T, options?: CloneOptions): T;
export default deepClone;
