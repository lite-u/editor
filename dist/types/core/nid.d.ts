/**
 * Simple, secure nanoid-like function for generating unique element IDs
 * inside a file. Suitable for up to tens of thousands of elements per file.
 *
 * Uses `crypto.getRandomValues` for strong randomness.
 *
 * @param size Number of characters in the ID (default: 6)
 * @returns A unique, short ID string (e.g., "aZ9x3B")
 */
export declare const nid: (size?: number) => string;
export default nid;
