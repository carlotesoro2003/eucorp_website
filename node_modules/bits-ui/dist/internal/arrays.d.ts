/**
 * Checks if two arrays are equal by comparing their values.
 */
export declare function arraysAreEqual<T extends Array<unknown>>(arr1: T, arr2: T): boolean;
/**
 * Splits an array into chunks of a given size.
 * @param arr The array to split.
 * @param size The size of each chunk.
 * @returns An array of arrays, where each sub-array has `size` elements from the original array.
 * @example ```ts
 * const arr = [1, 2, 3, 4, 5, 6, 7, 8];
 * const chunks = chunk(arr, 3);
 * // chunks = [[1, 2, 3], [4, 5, 6], [7, 8]]
 * ```
 */
export declare function chunk<T>(arr: T[], size: number): T[][];
/**
 * Checks if the given index is valid for the given array.
 *
 * @param index - The index to check
 * @param arr - The array to check
 */
export declare function isValidIndex(index: number, arr: unknown[]): boolean;
/**
 * Returns the array element after the given index, or undefined for out-of-bounds or empty arrays.
 * @param array the array.
 * @param index the index of the current element.
 * @param loop loop to the beginning of the array if the next index is out of bounds?
 */
/**
 * Returns the array element after the given index, or undefined for out-of-bounds or empty arrays.
 * For single-element arrays, returns the element if the index is 0.
 * @param array the array.
 * @param index the index of the current element.
 * @param loop loop to the beginning of the array if the next index is out of bounds?
 */
export declare function next<T>(array: T[], index: number, loop?: boolean): T | undefined;
/**
 * Returns the array element prior to the given index, or undefined for out-of-bounds or empty arrays.
 * For single-element arrays, returns the element if the index is 0.
 * @param array the array.
 * @param index the index of the current element.
 * @param loop loop to the end of the array if the previous index is out of bounds?
 */
export declare function prev<T>(array: T[], index: number, loop?: boolean): T | undefined;
/**
 * Returns the element some number after the given index. If the target index is out of bounds:
 *   - If looping is disabled, the first or last element will be returned.
 *   - If looping is enabled, it will wrap around the array.
 * Returns undefined for empty arrays or out-of-bounds initial indices.
 * @param array the array.
 * @param index the index of the current element.
 * @param increment the number of elements to move forward (can be negative).
 * @param loop loop around the array if the target index is out of bounds?
 */
export declare function forward<T>(array: T[], index: number, increment: number, loop?: boolean): T | undefined;
/**
 * Returns the element some number before the given index. If the target index is out of bounds:
 *   - If looping is disabled, the first or last element will be returned.
 *   - If looping is enabled, it will wrap around the array.
 * Returns undefined for empty arrays or out-of-bounds initial indices.
 * @param array the array.
 * @param index the index of the current element.
 * @param decrement the number of elements to move backward (can be negative).
 * @param loop loop around the array if the target index is out of bounds?
 */
export declare function backward<T>(array: T[], index: number, decrement: number, loop?: boolean): T | undefined;
/**
 * This is the "meat" of the typeahead matching logic. It takes in all the values,
 * the search and the current match, and returns the next match (or `undefined`).
 *
 * We normalize the search because if a user has repeatedly pressed a character,
 * we want the exact same behavior as if we only had that one character
 * (ie. cycle through options starting with that character)
 *
 * We also reorder the values by wrapping the array around the current match.
 * This is so we always look forward from the current match, and picking the first
 * match will always be the correct one.
 *
 * Finally, if the normalized search is exactly one character, we exclude the
 * current match from the values because otherwise it would be the first to match always
 * and focus would never move. This is as opposed to the regular case, where we
 * don't want focus to move if the current match still matches.
 */
export declare function getNextMatch(values: string[], search: string, currentMatch?: string): string | undefined;
/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
export declare function wrapArray<T>(array: T[], startIndex: number): T[];
