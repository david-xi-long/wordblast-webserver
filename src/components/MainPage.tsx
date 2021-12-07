import { FunctionComponent, useContext } from 'react';
import Link from 'next/link';
import { Avatar, Button } from '@mantine/core';
import { useMediaQuery } from 'react-responsive';
import router from 'next/router';
import { useNotifications } from '@mantine/notifications';
import MainBomb from './icons/MainBomb';
import Bolt from './icons/Bolt';
import Pencil from './icons/Pencil';
import MainButton from './utils/MainButton';
import PlayerCount from './utils/PlayerCount';
import { AuthenticationContext } from './authentication/Authentication';

const NewMainPage: FunctionComponent = () => {
    const appearBomb = useMediaQuery({ query: '(min-width: 1100px)' });
    const buttonDesc = useMediaQuery({ query: '(min-width: 650px)' });
    const rowButtons = useMediaQuery({ query: '(min-width: 500px)' });
    const notifications = useNotifications();

    const { isAuthenticated } = useContext(AuthenticationContext);

    const callGameEndpoint = async (
        endpoint: string,
        // eslint-disable-next-line no-undef
        options: RequestInit = {}
    ) => {
        const response = await fetch(
            `http://localhost:8080/api/game/${endpoint}`,
            options
        );

        if (response.status !== 200) {
            notifications.showNotification({
                color: 'red',
                title: 'Error',
                message: 'An unexpected error occurred. Try again later.',
            });
            return;
        }

        const { sid } = await response.json();

        router.push(`/game/${sid}`);
    };

    const joinAvailableGame = () => callGameEndpoint('available');

    const joinNewGame = () =>
        callGameEndpoint('', {
            method: 'POST',
            credentials: 'include',
        });

    return (
        <div className="relative min-h-screen w-full bg-[#06080a]">
            <header
                className={`p-8 flex justify-between ${
                    rowButtons ? 'items-center' : 'items-start'
                }`}
            >
                <Link href="/" passHref>
                    <button
                        type="button"
                        className="text-xl font-semibold text-blue-200"
                    >
                        wordblast.io
                    </button>
                </Link>

                {!isAuthenticated && (
                    <nav
                        className={`flex gap-2 ${
                            rowButtons ? 'flex-row' : 'flex-col'
                        }`}
                    >
                        <Link href="/signup" passHref>
                            <Button variant="light" color="gray">
                                Create account
                            </Button>
                        </Link>

                        <Link href="/login" passHref>
                            <Button variant="light" color="gray">
                                Login
                            </Button>
                        </Link>
                    </nav>
                )}

                {isAuthenticated && <Avatar radius="xl" />}
            </header>

            <main className="mt-16 flex flex-col items-center">
                <section className="p-16 w-full max-w-[1400px] flex justify-between items-center space-x-16">
                    <div>
                        <p className="font-mont font-semibold text-white text-3xl max-w-[32rem] leading-normal">
                            Guess a word before the bomb explodes!
                        </p>

                        <div
                            className={`mt-8 flex gap-4 ${
                                rowButtons
                                    ? 'flex-row'
                                    : 'flex-col max-w-[12rem]'
                            }`}
                        >
                            <MainButton onClick={joinAvailableGame}>
                                <Bolt
                                    height="h-5"
                                    width="w-5"
                                    color="text-neutral-300"
                                    className="flex-shrink-0"
                                />

                                <div className="ml-3 text-left">
                                    <h3 className="font-semibold text-neutral-300 text-lg">
                                        Quick Play
                                    </h3>
                                    {buttonDesc && (
                                        <p className="text-neutral-400 text-base">
                                            Play with random players.
                                        </p>
                                    )}
                                </div>
                            </MainButton>

                            <MainButton
                                onClick={joinNewGame}
                                disabled={!isAuthenticated}
                            >
                                <Pencil
                                    height="h-5"
                                    width="w-5"
                                    color="text-neutral-300"
                                    className="flex-shrink-0"
                                />

                                <div className="ml-3 text-left">
                                    <h3 className="font-semibold text-neutral-300 text-lg">
                                        Custom Game
                                    </h3>
                                    {buttonDesc && (
                                        <p className="text-neutral-400 text-base">
                                            {isAuthenticated
                                                ? 'Play solo or with friends.'
                                                : 'Login to create games.'}
                                        </p>
                                    )}
                                </div>
                            </MainButton>
                        </div>
                    </div>

                    {appearBomb && <MainBomb />}
                </section>
            </main>

            <span className="absolute left-2 bottom-2">
                <Button
                    variant="light"
                    color="gray"
                    onClick={() => router.push('/tutorial')}
                >
                    Tutorial
                </Button>
            </span>

            <PlayerCount />
        </div>
    );
};

export default NewMainPage;
