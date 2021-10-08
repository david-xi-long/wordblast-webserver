const tailwindForms = require('@tailwindcss/forms');
const vechaiCore = require('@vechaiui/core');

module.exports = {
    mode: 'jit',
    purge: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './node_modules/@vechaiui/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [tailwindForms, vechaiCore],
};
