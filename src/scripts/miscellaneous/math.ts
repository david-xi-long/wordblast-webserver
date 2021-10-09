export const uid = (len = 8) => {
    // If on server, return an empty string.
    if (typeof window === 'undefined') return '';

    const arr = new Uint8Array(len / 2);
    crypto.getRandomValues(arr);

    return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
};

// Remove this if adding more exports to this file.
export default uid;
