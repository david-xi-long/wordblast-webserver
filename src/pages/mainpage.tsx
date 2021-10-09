import { Button } from '@vechaiui/button';
import { useNotification } from '@vechaiui/notification';
import { useRouter } from 'next/router';
import { useState } from 'react';

function MainPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const notification = useNotification();

    const joinAvailableGame = async () => {
        setIsLoading(true);

        const response = await fetch(
            'http://localhost:8080/api/game/available'
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

    return (
        <div>
            <div className="mainpage">
                <code style={{ fontSize: '48px' }}>wordblast.io</code>
                <br />
                <code>click play to join a game.</code>
                <br />
                <br />
                <div className="row space-x-4">
                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                        size="lg"
                        loading={isLoading}
                        onClick={joinAvailableGame}
                    >
                        Play
                    </Button>
                    {/* Public games for now. */}
                    {/* <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                        size="lg"
                        onClick={() => {}}
                    >
                        Play with friends
                    </Button> */}
                </div>
            </div>
        </div>
    );
}

export default MainPage;
