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
import randomOptions from '../../scripts/utils/bigHead';
import getGameEndpoint from '../../scripts/utils/endpoint';

// This is ran on the web server.
// Inform the client whether the game exists or not.
export const getServerSideProps = async (context) => {
    const props = { gameExists: false, gameUid: null };

    const response = await fetch(
        `${getGameEndpoint()}/api/game/${context.params?.gameId}`
    );

    props.gameExists = response.status === 200;

    if (response.status === 200) {
        const { uid } = await response.json();
        props.gameUid = uid;
    }

    return { props };
};

const GamePage: FunctionComponent<{ gameUid: string }> = ({ gameUid }) => {
    const isSmallScreen = useMediaQuery({ maxWidth: 1024 });

    const { userUid } = useContext(AuthenticationContext);

    const router = useRouter();
    const { gameId: gameSid } = router.query as { gameId: string };

    const [isConnected, setIsConnected] = useState(false);
    const [hasJoinedGame, setHasJoinedGame] = useState(false);
    const [username, setUsername] = useState('');
    const [gameSocket] = useState(new GameSocket());
    const [initialSettingValues, setInitialSettingValues] =
        useState<Record<string, string>>();
    const [isOwner, setIsOwner] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const [roundInfo, setRoundInfo] = useState<RoundInfo>();

    const joinGame = () => {
        gameSocket
            .requestResponse<PacketInGameInfo>(
                'join-game',
                new PacketOutGameJoin(
                    gameUid,
                    username,
                    userUid,
                    randomOptions()
                )
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
                gameUid={gameUid}
                gameSocket={gameSocket}
                setUsername={setUsername}
            />
        );
    }

    return (
        <div className="relative flex">
            <div className="flex-grow">
                {roundInfo === undefined && (
                    <GameLobbyScreen
                        gameUid={gameUid}
                        gameSid={gameSid}
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
                        gameUid={gameUid}
                    />
                )}
            </div>

            <GameSettings
                disabled={!isOwner || roundInfo !== undefined}
                gameUid={gameUid}
                gameSocket={gameSocket}
                isOwner={isOwner}
                initialSettingValues={initialSettingValues}
            />

            {!isSmallScreen && (
                <Chatbox username={username}>
                    <Chatbox.Game gameUid={gameUid} gameSocket={gameSocket} />
                </Chatbox>
            )}

            <GamePopup username={username} gameSocket={gameSocket} />
        </div>
    );
};

const NotFoundPage: FunctionComponent = () => <div>Game not found.</div>;

const Proxy: NextPage<{ gameExists: boolean; gameUid: string | null }> = ({
    gameExists,
    gameUid,
}) =>
    gameExists ? <GamePage gameUid={gameUid as string} /> : <NotFoundPage />;

export default Proxy;
