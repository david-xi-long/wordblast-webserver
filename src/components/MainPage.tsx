import { Button } from '@vechaiui/button';
import { useNotification } from '@vechaiui/notification';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { handleErr } from '../scripts/miscellaneous/error';
import { AuthenticationContext } from './authentication/Authentication';

function MainPage() {
    const router = useRouter();
    const notification = useNotification();

    const [isLoading, setIsLoading] = useState(false);
    const [onlineCount, setOnlineCount] = useState<number | undefined>();

    const { isAuthenticated } = useContext(AuthenticationContext);

    useEffect(() => {
        const id = setInterval(async () => {
            const [response] = await handleErr(
                fetch('http://localhost:8080/api/game/count')
            );

            if (response == null) return;

            const { count } = await response.json();

            setOnlineCount(count);
        }, 10000);

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
                <code className="text-6xl font-semibold">wordblast.io</code>
                <div className="mt-6 row space-x-2">
                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                        size="lg"
                        loading={isLoading}
                        onClick={joinAvailableGame}
                    >
                        Multiplayer
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                        size="lg"
                        loading={isLoading}
                        onClick={singlePlayer}
                    >
                        Singleplayer
                    </Button>
                    {isAuthenticated && (
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            size="lg"
                            loading={isLoading}
                            onClick={joinNewGame}
                        >
                            Create game
                        </Button>
                    )}
                </div>
            </div>
            {onlineCount !== undefined && (
                <span className="mb-2 mr-2 py-2 px-3 bg-neutral-700 rounded-md self-end">
                    <p className="text-lg font-semibold">
                        {onlineCount} playing
                    </p>
                </span>
            )}
        </div>
    );
}

export default MainPage;
