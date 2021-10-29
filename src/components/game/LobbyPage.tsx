import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import { Button } from '@vechaiui/button';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInGameInfo from '../../scripts/packets/PacketInGameInfo';
import PacketInPlayerState from '../../scripts/packets/PacketInPlayerState';
import PacketInUsernameChange from '../../scripts/packets/PacketInUsernameChange';
import PacketOutPlayerReadyState from '../../scripts/packets/PacketOutPlayerReadyState';
import PacketOutGameJoin from '../../scripts/packets/PacketOutGameJoin';
import Chatbox from './Chatbox';
import LobbyPlayers from './LobbyPlayers';
import LobbyUsernameField from './LobbyUsernameField';
import MultiplayerGameplayPage from '../../pages/game/MultiplayerGameplayPage';
import SinglePlayerLobby from '../../pages/game/SinglePlayerLobby';
import PacketInStartGame from '../../scripts/packets/PacketInStartGame';
import PacketOutStartGame from '../../scripts/packets/PacketOutStartGame';
import Packet from '../../scripts/packets/Packet';
import PacketInPlayerReadyState from '../../scripts/packets/PacketInPlayerReadyState';
import { Player } from '../../types';

const LobbyPage: FunctionComponent<{
    gameSocket: GameSocket;
    username: string;
}> = ({ gameSocket, username: selectedUsername }) => {
    const router = useRouter();
    const { gameId } = router.query as { gameId: string };

    const [username, setUsername] = useState(selectedUsername);
    const [players, setPlayers] = useState([] as Player[]);
    const [startGame, setStartGame] = useState(false);
    const [ready, setReady] = useState(false);

    const setPlayerState = (playerName: string, state: boolean) => {
        const hasPlayer =
            players.find((p) => p.username === playerName) !== undefined;

        if (state && !hasPlayer) {
            setPlayers((curPlayers) => [
                ...curPlayers,
                { username: playerName, ready: false },
            ]);
        }

        if (!state) {
            setPlayers((curPlayers) =>
                curPlayers.filter((p) => p.username !== playerName)
            );
        }
    };

    const changeUsername = (oldUsername: string, newUsername: string) => {
        setPlayers((curPlayers) =>
            curPlayers.map((p) =>
                p.username === oldUsername ? { ...p, username: newUsername } : p
            )
        );
    };

    const setPlayerReadyState = (playerName: string, state: boolean) => {
        setPlayers((curPlayers) =>
            curPlayers.map((p) =>
                p.username === playerName ? { ...p, ready: state } : p
            )
        );
    };

    const registerInitHandlers = () => {
        gameSocket.subscribe<PacketInPlayerState>('player-state', (packet) => {
            setPlayerState(packet.getUsername(), packet.getState());
        });

        gameSocket.subscribe<PacketInUsernameChange>(
            'change-username',
            (packet) => {
                changeUsername(
                    packet.getOldUsername(),
                    packet.getNewUsername()
                );
            }
        );

        gameSocket.subscribe<PacketInPlayerReadyState>(
            'player-ready-state',
            (packet) =>
                setPlayerReadyState(packet.getUsername(), packet.isReady())
        );
    };

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
                    return;
                    // An exception occured while sending data to the game socket.
                    // Redirect to the main page, as the game is probably broken.
                    router.replace('/');
                }
            );
    };

    console.log(players);

    const toggleReadyState = () => {
        const newState = !ready;

        setReady(newState);

        gameSocket.fireAndForget(
            'player-ready-state',
            new PacketOutPlayerReadyState(gameId, username, newState)
        );
    };

    const startTheGame = () => {
        gameSocket.subscribe<PacketInStartGame>(
            'start-game',
            (packet: { getPlayers: () => any }) => {
                setPlayers(packet.getPlayers);
                setStartGame(true);
                // return <MultiplayerGameplayPage players = {players} />;
                // router.push("/game/MultiplayerGameplayPage");
            }
        );
    };

    const sendStartGameRequest = async () => {
        gameSocket.fireAndForget(
            'start-game',
            new PacketOutStartGame(
                gameId,
                players.map((p) => p.username)
            )
        );
    };

    // Run only once after the component has mounted.
    useEffect(() => {
        joinGame();
        registerInitHandlers();
        startTheGame();
        // Do not care about dependencies.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (startGame) {
        return (
            <MultiplayerGameplayPage
                players={players}
                gameSocket={gameSocket}
                username={username}
            />
        );
    }

    return (
        <div className="relative h-screen flex">
            <div className="absolute p-3 left-0 bottom-0">
                <div className="mt-2">
                    <Button
                        type="button"
                        variant="solid"
                        color="primary"
                        onClick={sendStartGameRequest}
                    >
                        Force Start Game
                    </Button>
                </div>
            </div>

            <div className="h-full flex flex-col justify-center items-center flex-grow">
                <div className="my-auto flex flex-col justify-center items-center">
                    <LobbyPlayers players={players} />
                    <Button
                        size="lg"
                        type="button"
                        variant="solid"
                        color="primary"
                        onClick={toggleReadyState}
                        className="mt-8"
                    >
                        {ready ? 'Unready' : 'Ready'}
                    </Button>
                </div>
                <LobbyUsernameField
                    gameId={gameId}
                    gameSocket={gameSocket}
                    username={username}
                    setUsername={setUsername}
                />
            </div>
            <Chatbox username={username}>
                <Chatbox.Game gameId={gameId} gameSocket={gameSocket} />
            </Chatbox>
        </div>
    );
};

export default LobbyPage;
