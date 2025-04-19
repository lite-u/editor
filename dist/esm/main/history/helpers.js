const extractIdSetFromArray = (from) => {
    return new Set(from.map(item => item.id));
};
const arrayToMap = (from) => {
    return new Map(from.map(item => [item.id, item]));
};
export { extractIdSetFromArray, arrayToMap };
