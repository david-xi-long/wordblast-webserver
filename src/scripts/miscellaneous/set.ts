export const map = <T>(set: Set<T>, fn: (value: T) => any) => {
    const mapped = new Set<T>();

    set.forEach((value) => {
        mapped.add(fn(value));
    });

    return mapped;
};

// Remove this if adding more exports to this file.
export default map;
