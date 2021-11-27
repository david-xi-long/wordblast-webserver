import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Chatbox from '../../components/game/Chatbox';
import GameLobbyScreen from '../../components/game/GameLobbyScreen';
import UsernameSelectPage from '../../components/game/UsernameSelectPage';
import GameSocket from '../../scripts/socket/GameSocket';
import PacketInRoundInfo from '../../scripts/packets/in/PacketInRoundInfo';
import GameplayScreen from '../../components/game/GameplayScreen';
import PacketInGameInfo from '../../scripts/packets/in/PacketInGameInfo';
import PacketOutGameJoin from '../../scripts/packets/out/PacketOutGameJoin';
import { Player, RoundInfo } from '../../types';
import { AuthenticationContext } from '../../components/authentication/Authentication';
import GameSettings from '../../components/game/GameSettings';
import PacketInPlayerJoin from '../../scripts/packets/in/PacketInPlayerJoin';
import PacketInPlayerQuit from '../../scripts/packets/in/PacketInPlayerQuit';
import PacketInPlayerEliminated from '../../scripts/packets/in/PacketInPlayerEliminated';
import GamePopup from '../../components/game/GamePopup';
import PacketInLivesChange from '../../scripts/packets/in/PacketInLivesChange';

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
    const isSmallScreen = useMediaQuery({ maxWidth: 1024 });

    const { userUid } = useContext(AuthenticationContext);

    const router = useRouter();
    const { gameId } = router.query as { gameId: string };

    const [isConnected, setIsConnected] = useState(false);
    const [hasJoinedGame, setHasJoinedGame] = useState(false);
    const [username, setUsername] = useState('');
    const [gameSocket] = useState(new GameSocket());
    const [players, setPlayers] = useState<Player[]>([]);
    const [roundInfo, setRoundInfo] = useState<RoundInfo>();
    const [isOwner, setIsOwner] = useState(false);
    const [initialSettingValues, setInitialSettingValues] =
        useState<Record<string, string>>();

    const joinGame = () => {
        gameSocket
            .requestResponse<PacketInGameInfo>(
                'join-game',
                new PacketOutGameJoin(gameId, username)
            )
            .then(
                (packet) => {
                    setPlayers(packet.getActivePlayerInfos());
                    setIsOwner(
                        userUid != null && userUid === packet.getOwnerUid()
                    );
                    setInitialSettingValues(packet.getSettings());
                },
                () => {
                    // An exception occured while sending data to the game socket.
                    // Redirect to the main page, as the game is probably broken.
                    router.replace('/');
                }
            );
    };

    const removePlayer = (removeUsername: string) => {
        setPlayers((curPlayers) =>
            curPlayers.filter((player) => player.username !== removeUsername)
        );
    };

    const registerInitHandlers = async () => {
        await gameSocket.connect();

        setIsConnected(true);

        gameSocket.subscribe<PacketInPlayerJoin>('player-join', (packet) => {
            setPlayers((curPlayers) => [...curPlayers, packet.getPlayer()]);
        });

        gameSocket.subscribe<PacketInPlayerQuit>('player-quit', (packet) => {
            removePlayer(packet.getPlayer().username);
        });

        gameSocket.subscribe<PacketInRoundInfo>('round-info', (packet) => {
            setRoundInfo(packet.toRoundInfo());
        });

        gameSocket.subscribe<PacketInLivesChange>('lives-change', (packet) => {
            setPlayers((curPlayers) => {
                const changedPlayer = curPlayers.find(
                    (player) => player.username === packet.getUsername()
                );

                if (changedPlayer !== undefined) {
                    changedPlayer.lives = packet.getLives();
                }

                return [...curPlayers];
            });
        });

        gameSocket.subscribe<PacketInPlayerEliminated>(
            'player-eliminated',
            (packet) => {
                removePlayer(packet.getUsername());
            }
        );
    };

    useEffect(() => {
        registerInitHandlers();

        return () => {
            gameSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (hasJoinedGame || username.length === 0) return;
        setHasJoinedGame(true);

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
        <div className="relative flex">
            <div className="flex-grow">
                {roundInfo === undefined && (
                    <GameLobbyScreen
                        gameId={gameId}
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
                        setPlayers={setPlayers}
                        roundInfo={roundInfo}
                        username={username}
                        gameId={gameId}
                    />
                )}
            </div>

            <GameSettings
                disabled={!isOwner || roundInfo !== undefined}
                gameId={gameId}
                gameSocket={gameSocket}
                isOwner={isOwner}
                initialSettingValues={initialSettingValues}
            />

            {!isSmallScreen && (
                <Chatbox username={username}>
                    <Chatbox.Game gameId={gameId} gameSocket={gameSocket} />
                </Chatbox>
            )}

            <GamePopup username={username} gameSocket={gameSocket} />
        </div>
    );
};

const NotFoundPage: FunctionComponent = () => <div>Game not found.</div>;

// Prop types defined by NextPage.
// eslint-disable-next-line react/prop-types
const Proxy: NextPage<{ gameExists: boolean }> = ({ gameExists }) =>
    gameExists ? <GamePage /> : <NotFoundPage />;

export default Proxy;
