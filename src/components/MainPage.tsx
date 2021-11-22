import { Button } from '@vechaiui/button';
import { useNotification } from '@vechaiui/notification';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { handleErr } from '../scripts/miscellaneous/error';
import { AuthenticationContext } from './authentication/Authentication';

function MainPage() {
    const smallScreen = useMediaQuery({ minWidth: 768 });

    const router = useRouter();
    const notification = useNotification();

    const [isLoading, setIsLoading] = useState(false);
    const [onlineCount, setOnlineCount] = useState<number | undefined>();

    const { isAuthenticated } = useContext(AuthenticationContext);

    useEffect(() => {
        const getPlayerCount = async () => {
            const [response] = await handleErr(
                fetch('http://localhost:8080/api/game/count')
            );

            if (response == null) return;

            const { count } = await response.json();

            setOnlineCount(count);
        };

        getPlayerCount();
        const id = setInterval(getPlayerCount, 10000);

        return () => {
            clearInterval(id);
        };
    }, []);

    const callGameEndpoint = async (
        endpoint: string,
        // eslint-disable-next-line no-undef
        options: RequestInit = {}
    ) => {
        setIsLoading(true);

        const response = await fetch(
            `http://localhost:8080/api/game/${endpoint}`,
            options
        );

        setIsLoading(false);

        if (response.status !== 200) {
            notification({
                title: 'Error',
                description: 'An unexpected error occurred. Try again later.',
                status: 'error',
            });
            return;
        }

        const { uid } = await response.json();

        router.push(`/game/${uid}`);
    };

    const joinAvailableGame = () => callGameEndpoint('available');

    const joinNewGame = () =>
        callGameEndpoint('', {
            method: 'POST',
            credentials: 'include',
        });

    const singlePlayer = async () => {
        setIsLoading(true);

        const response = await fetch(
            'http://localhost:8080/api/game/singlePlayer'
        );

        setIsLoading(false);

        if (response.status !== 200) {
            notification({
                title: 'Error',
                description: 'An unexpected error occurred. Try again later.',
                status: 'error',
            });
            return;
        }

        const { uid } = await response.json();

        router.push(`/game/SinglePlayerLobby`);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="my-auto flex flex-col items-center">
                <code
                    id="logo"
                    className="text-4xl sm:text-5xl md:text-6xl font-semibold"
                >
                    wordblast.io
                </code>
                <div className="px-8 mt-6 flex flex-wrap gap-2 justify-center items-center">
                    <Button
                        className="flex-grow"
                        type="submit"
                        variant="solid"
                        color="primary"
                        size={smallScreen ? 'lg' : 'md'}
                        loading={isLoading}
                        onClick={joinAvailableGame}
                    >
                        Multiplayer
                    </Button>
                    <Button
                        className="flex-grow"
                        type="submit"
                        variant="solid"
                        color="primary"
                        size={smallScreen ? 'lg' : 'md'}
                        loading={isLoading}
                        onClick={singlePlayer}
                    >
                        Singleplayer
                    </Button>
                    {isAuthenticated && (
                        <Button
                            className="flex-grow"
                            type="submit"
                            variant="solid"
                            color="primary"
                            size={smallScreen ? 'lg' : 'md'}
                            loading={isLoading}
                            onClick={joinNewGame}
                        >
                            Play with friends
                        </Button>
                    )}
                </div>
            </div>
            {onlineCount !== undefined && (
                <span className="mb-2 mr-2 py-2 px-3 bg-neutral-700 rounded-md self-end">
                    <p className="text-sm md:text-lg font-semibold">
                        {onlineCount} playing
                    </p>
                </span>
            )}
        </div>
    );
}

export default MainPage;
