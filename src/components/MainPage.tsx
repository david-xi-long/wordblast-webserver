import { Button } from '@vechaiui/button';
import { useNotification } from '@vechaiui/notification';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { AuthenticationContext } from './authentication/Authentication';

function MainPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const notification = useNotification();

    const { isAuthenticated } = useContext(AuthenticationContext);

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
        <div className="mainpage">
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
    );
}

export default MainPage;
