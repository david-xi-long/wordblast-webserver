import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import { Button } from '@vechaiui/button';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInGameInfo from '../../scripts/packets/PacketInGameInfo';
import PacketInPlayerState from '../../scripts/packets/PacketInPlayerState';
import PacketInUsernameChange from '../../scripts/packets/PacketInUsernameChange';
import PacketOutGameJoin from '../../scripts/packets/PacketOutGameJoin';
import Chatbox from './Chatbox';
import LobbyPlayers from './LobbyPlayers';
import LobbyUsernameField from './LobbyUsernameField';
import MultiplayerGameplayPage from '../../pages/game/MultiplayerGameplayPage';
import SinglePlayerLobby from '../../pages/game/SinglePlayerLobby';
import PacketInStartGame from '../../scripts/packets/PacketInStartGame';
import PacketOutStartGame from '../../scripts/packets/PacketOutStartGame';
import Packet from '../../scripts/packets/Packet';

const LobbyPage: FunctionComponent<{
    gameSocket: GameSocket;
    username: string;
}> = ({ gameSocket, username: selectedUsername }) => {
    const router = useRouter();
    const { gameId } = router.query as { gameId: string };

    const [username, setUsername] = useState(selectedUsername);
    const [players, setPlayers] = useState([] as string[]);
    const [startGame, setStartGame] = useState(false);

    const setPlayerState = (playerName: string, state: boolean) => {
        if (state && !players.includes(playerName)) {
            setPlayers((curPlayers) => [...curPlayers, playerName]);
        }

        if (!state) {
            setPlayers((curPlayers) =>
                curPlayers.filter((p) => p !== playerName)
            );
        }
    };

    const changeUsername = (oldUsername: string, newUsername: string) => {
        setPlayers((curPlayers) =>
            curPlayers.map((p) => (p === oldUsername ? newUsername : p))
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
    };

    const joinGame = () => {
        gameSocket
            .requestResponse<PacketInGameInfo>(
                'join-game',
                new PacketOutGameJoin(gameId, username)
            )
            .then(
                (packet) => {
                    setPlayers(packet.getActivePlayerNames());
                },
                () => {
                    // An exception occured while sending data to the game socket.
                    // Redirect to the main page, as the game is probably broken.
                    router.replace('/');
                }
            );
    };

    // TODO: Implement these button handlers.
    const getReadyForTheGame = () => {};

    const startTheGame = () => {
        gameSocket.subscribe<PacketInStartGame>('start-game', (packet: { getPlayers: () => any; }) => {
            setPlayers(packet.getPlayers);
            setStartGame(true);
            //return <MultiplayerGameplayPage players = {players} />;
            //router.push("/game/MultiplayerGameplayPage");
        });
    }

    const sendStartGameRequest = async () => {
        gameSocket.fireAndForget("start-game", new PacketOutStartGame(gameId, players));
    }
    
    // Run only once after the component has mounted.
    useEffect(() => {
        joinGame();
        registerInitHandlers();
        startTheGame();
        // Do not care about dependencies.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        
    }, []);

    if (startGame) {
        return <MultiplayerGameplayPage players = {players} gameSocket = {gameSocket} />;
    }

    return (
        <div className="relative h-screen flex">
            <div className="absolute p-3 left-0 bottom-0">
                <div>
                    <Button
                        type="button"
                        variant="solid"
                        color="primary"
                        onClick={getReadyForTheGame}
                    >
                        Ready To Play
                    </Button>
                </div>
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
                <div className="my-auto">
                    <LobbyPlayers players={players} />
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

