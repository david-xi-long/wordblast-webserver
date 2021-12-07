/*import { Button } from '@vechaiui/button';
import { useNotification } from '@vechaiui/notification';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { AuthenticationContext } from '../components/authentication/Authentication';
import PlayerCount from '../components/utils/PlayerCount';

function MainPage() {
    const smallScreen = useMediaQuery({ minWidth: 768 });
    const router = useRouter();
    const notification = useNotification();
    const { isAuthenticated } = useContext(AuthenticationContext);
    const [isLoading, setIsLoading] = useState(false);

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

    const goToTutorial = () => router.push('/tutorial');

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="self-end mt-2 mr-2">
                <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    size={!smallScreen ? 'lg' : 'md'}
                    loading={isLoading}
                    onClick={goToTutorial}
                    suppressHydrationWarning
                >
                    How To Play
                </Button>
            </div>

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
                        size={!smallScreen ? 'lg' : 'md'}
                        loading={isLoading}
                        onClick={joinAvailableGame}
                        suppressHydrationWarning
                    >
                        Join Random Game
                    </Button>

                    <Button
                        title={
                            isAuthenticated
                                ? 'Create New Game'
                                : 'Login to create custom games.'
                        }
                        disabled={!isAuthenticated}
                        className="flex-grow"
                        type="submit"
                        variant="solid"
                        color="primary"
                        size={!smallScreen ? 'lg' : 'md'}
                        loading={isLoading}
                        onClick={joinNewGame}
                        suppressHydrationWarning
                    >
                        Create New Game
                    </Button>
                </div>
            </div>

            <PlayerCount />
        </div>
    );
}

export default MainPage; */
export {};
