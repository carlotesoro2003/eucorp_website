/**
 * Checks if two arrays are equal by comparing their values.
 */
export function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((value, index) => isEqual(value, arr2[index]));
}
/**
 * A utility function that compares two values for equality.
 */
function isEqual(a, b) {
    if (Number.isNaN(a) && Number.isNaN(b)) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        return arraysAreEqual(a, b);
    }
    if (typeof a === "object" && typeof b === "object") {
        return isDeepEqual(a, b);
    }
    return Object.is(a, b);
}
/**
 * A utility function that compares two values for deep equality.
 */
function isDeepEqual(a, b) {
    if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
        return false;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
        return false;
    }
    for (const key of aKeys) {
        if (!bKeys.includes(key)) {
            return false;
        }
        if (!isEqual(a[key], b[key])) {
            return false;
        }
    }
    return true;
}
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
export function chunk(arr, size) {
    if (size <= 0) {
        return [];
    }
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
/**
 * Checks if the given index is valid for the given array.
 *
 * @param index - The index to check
 * @param arr - The array to check
 */
export function isValidIndex(index, arr) {
    return index >= 0 && index < arr.length;
}
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
export function next(array, index, loop = true) {
    if (array.length === 0 || index < 0 || index >= array.length) {
        return undefined;
    }
    if (array.length === 1 && index === 0) {
        return array[0];
    }
    if (index === array.length - 1) {
        return loop ? array[0] : undefined;
    }
    return array[index + 1];
}
/**
 * Returns the array element prior to the given index, or undefined for out-of-bounds or empty arrays.
 * For single-element arrays, returns the element if the index is 0.
 * @param array the array.
 * @param index the index of the current element.
 * @param loop loop to the end of the array if the previous index is out of bounds?
 */
export function prev(array, index, loop = true) {
    if (array.length === 0 || index < 0 || index >= array.length) {
        return undefined;
    }
    if (array.length === 1 && index === 0) {
        return array[0];
    }
    if (index === 0) {
        return loop ? array[array.length - 1] : undefined;
    }
    return array[index - 1];
}
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
export function forward(array, index, increment, loop = true) {
    if (array.length === 0 || index < 0 || index >= array.length) {
        return undefined;
    }
    let targetIndex = index + increment;
    if (loop) {
        // Ensure positive modulus
        targetIndex = ((targetIndex % array.length) + array.length) % array.length;
    }
    else {
        // Clamp to array bounds when not looping
        targetIndex = Math.max(0, Math.min(targetIndex, array.length - 1));
    }
    return array[targetIndex];
}
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
export function backward(array, index, decrement, loop = true) {
    if (array.length === 0 || index < 0 || index >= array.length) {
        return undefined;
    }
    let targetIndex = index - decrement;
    if (loop) {
        // Ensure positive modulus
        targetIndex = ((targetIndex % array.length) + array.length) % array.length;
    }
    else {
        // Clamp to array bounds when not looping
        targetIndex = Math.max(0, Math.min(targetIndex, array.length - 1));
    }
    return array[targetIndex];
}
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
export function getNextMatch(values, search, currentMatch) {
    const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
    const normalizedSearch = isRepeated ? search[0] : search;
    const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
    let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
    const excludeCurrentMatch = normalizedSearch.length === 1;
    if (excludeCurrentMatch)
        wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
    const nextMatch = wrappedValues.find((value) => value?.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
    return nextMatch !== currentMatch ? nextMatch : undefined;
}
/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
export function wrapArray(array, startIndex) {
    return array.map((_, index) => array[(startIndex + index) % array.length]);
}
