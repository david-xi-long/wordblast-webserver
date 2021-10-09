import { NextPage } from 'next';
import { FunctionComponent, useEffect, useState } from 'react';
import LobbyPage from '../../components/game/LobbyPage';
import UsernameSelectPage from '../../components/game/UsernameSelectPage';
import GameSocket from '../../scripts/game/GameSocket';

const env = 'dev';
const endpoints = {
    dev: 'http://localhost:8080/api/game/',
    prod: 'http://localhost:8080/api/game/',
};

// This is ran on the web server.
// Inform the client whether the game exists or not.
export const getServerSideProps = async (context) => {
    const response = await fetch(`${endpoints[env]}${context.params?.gameId}`);

    return {
        props: { gameExists: response.status === 200 },
    };
};

const GamePage: FunctionComponent = () => {
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const gameSocket = new GameSocket();

    useEffect(() => {
        (async () => {
            await gameSocket.connect();
            setIsConnected(true);
        })();

        return () => {
            gameSocket.disconnect();
        };
    });

    if (!isConnected) {
        return <div>Connecting...</div>;
    }

    if (username === '') {
        return (
            <UsernameSelectPage
                setUsername={setUsername}
                gameSocket={gameSocket}
            />
        );
    }

    return <LobbyPage />;
};

const NotFoundPage: FunctionComponent = () => <div>Game not found.</div>;

// Prop types defined by NextPage.
// eslint-disable-next-line react/prop-types
const Proxy: NextPage<{ gameExists: boolean }> = ({ gameExists }) =>
    gameExists ? <GamePage /> : <NotFoundPage />;

export default Proxy;
