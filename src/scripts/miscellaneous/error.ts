export const handleErr = async <T>(
    promise: Promise<T>
): Promise<[T, null] | [null, Error]> => {
    try {
        return [await promise, null];
    } catch (err) {
        return [null, err as Error];
    }
};

// Remove this if adding more exports to this file.
export default handleErr;
