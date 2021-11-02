import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import Chatbox from '../../components/game/Chatbox';
import GameLobbyScreen from '../../components/game/GameLobbyScreen';
import UsernameSelectPage from '../../components/game/UsernameSelectPage';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInRoundInfo from '../../scripts/packets/PacketInRoundInfo';
import GameplayScreen from '../../components/game/GameplayScreen';
import PacketInGameInfo from '../../scripts/packets/PacketInGameInfo';
import PacketOutGameJoin from '../../scripts/packets/PacketOutGameJoin';
import { Player, RoundInfo } from '../../types';

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
    const router = useRouter();
    const { gameId } = router.query as { gameId: string };

    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [gameSocket] = useState(new GameSocket());
    const [players, setPlayers] = useState([] as Player[]);
    const [roundInfo, setRoundInfo] = useState<RoundInfo>();

    const joinGame = () => {
        gameSocket
            .requestResponse<PacketInGameInfo>(
                'join-game',
                new PacketOutGameJoin(gameId, username)
            )
            .then(
                (packet) => {
                    setPlayers(
                        packet.getActivePlayerInfos().map((i) => ({
                            username: i.getUsername(),
                            ready: i.isReady(),
                        }))
                    );
                },
                () => {
                    // An exception occured while sending data to the game socket.
                    // Redirect to the main page, as the game is probably broken.
                    router.replace('/');
                }
            );
    };

    useEffect(() => {
        (async () => {
            await gameSocket.connect();

            setIsConnected(true);

            gameSocket.subscribe<PacketInRoundInfo>('round-info', (packet) => {
                setRoundInfo({
                    round: packet.getRound(),
                    username: packet.getPlayer(),
                    timeRemaining: packet.getTimeRemaining(),
                    sentAt: new Date(),
                });
            });
        })();

        return () => {
            gameSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (username.length === 0) return;
        joinGame();
    }, [username]);

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

    return (
        <div className="flex">
            <div className="flex-grow">
                {roundInfo === undefined && (
                    <GameLobbyScreen
                        gameSocket={gameSocket}
                        username={username}
                        players={players}
                        setPlayers={setPlayers}
                    />
                )}
                {roundInfo !== undefined && (
                    <GameplayScreen
                        gameSocket={gameSocket}
                        players={players}
                        roundInfo={roundInfo}
                    />
                )}
            </div>
            <Chatbox username={username}>
                <Chatbox.Game gameId={gameId} gameSocket={gameSocket} />
            </Chatbox>
        </div>
    );
};

const NotFoundPage: FunctionComponent = () => <div>Game not found.</div>;

// Prop types defined by NextPage.
// eslint-disable-next-line react/prop-types
const Proxy: NextPage<{ gameExists: boolean }> = ({ gameExists }) =>
    gameExists ? <GamePage /> : <NotFoundPage />;

export default Proxy;
