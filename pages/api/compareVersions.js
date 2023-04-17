/**
 * @function compareVersions
 * @description Compares two version numbers in the format 'x.y.z' and returns -1 if version 'a' is lower,
 * 1 if version 'a' is higher, and 0 if they are equal.
 * @param {string} a - The first version number to compare.
 * @param {string} b - The second version number to compare.
 * @returns {number} - Returns -1 if version 'a' is lower, 1 if version 'a' is higher, and 0 if they are equal.
 */
export default function compareVersions(a, b) {
    const aParts = a.split('.').map(part => parseInt(part));
    const bParts = b.split('.').map(part => parseInt(part));
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;
        if (aPart !== bPart) {
            return aPart < bPart ? -1 : 1;
        }
    }
    return 0;
}