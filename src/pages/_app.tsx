import '../styles/globals.css';
import type { AppProps } from 'next/app';
import {
    VechaiProvider,
    ColorScheme,
    colors,
    extendTheme,
} from '@vechaiui/react';
import { MantineProvider } from '@mantine/core';
import Authentication from '../components/authentication/Authentication';

export const midnight: ColorScheme = {
    id: 'midnight',
    type: 'dark',
    colors: {
        bg: {
            base: colors.trueGray['900'],
            fill: colors.trueGray['900'],
        },
        text: {
            foreground: colors.trueGray['100'],
            muted: colors.trueGray['300'],
        },
        primary: colors.rose,
        neutral: colors.trueGray,
    },
};

const theme = extendTheme({
    cursor: 'pointer',
    colorSchemes: {
        midnight,
    },
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme: 'dark' }}
        >
            <VechaiProvider theme={theme} colorScheme="midnight">
                <Authentication>
                    <Component {...pageProps} />
                </Authentication>
            </VechaiProvider>
        </MantineProvider>
    );
}

export default MyApp;
