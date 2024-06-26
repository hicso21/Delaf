export default function compareTwoObjects(obj1, obj2) {
    const keys = Object.keys(obj1);
    const distinctKeys = [];
    if (!equals(keys, Object.keys(obj2)))
        return "They don't have the same keys";
    for (let key of keys) {
        if (obj1[key] !== obj2[key]) distinctKeys.push(key);
    }
    if (distinctKeys.length === 0) return false;
    return distinctKeys;
}

const equals = function (arr1, arr2) {
    if (!arr1 || !Array.isArray(arr1)) {
        return false;
    }
    if (!arr2 || !Array.isArray(arr2)) {
        return false;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i in arr1) {
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            if (!equals(arr1[i], arr2[i])) {
                return false;
            }
        } else if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};
