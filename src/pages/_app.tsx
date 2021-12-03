import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Authentication from '../components/authentication/Authentication';
import NoSSR from '../components/utils/NoSSR';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme: 'dark' }}
        >
            <NotificationsProvider>
                <Authentication>
                    <NoSSR>
                        <Component {...pageProps} />
                    </NoSSR>
                </Authentication>
            </NotificationsProvider>
        </MantineProvider>
    );
}

export default MyApp;
