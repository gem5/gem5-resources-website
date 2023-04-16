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