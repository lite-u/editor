/**
 * Utility function to get the JSON standard type of a given variable as a string.
 *
 * @returns The JSON standard type of the variable in string form (e.g., "string", "number").
 * @param value
 */
declare function typeCheck(value: unknown): string;
export default typeCheck;
