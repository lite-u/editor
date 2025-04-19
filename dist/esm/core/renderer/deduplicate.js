const deduplicateObjectsByKeyValue = (objects) => {
    if (!Array.isArray(objects))
        return [];
    const seen = new Set();
    return objects.filter((item) => {
        const key = Object.keys(item)
            .sort()
            .map(key => `${key}:${String(item[key])}`)
            .join(';');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};
export default deduplicateObjectsByKeyValue;
//# sourceMappingURL=deduplicate.js.map