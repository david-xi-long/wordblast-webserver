import { useRouter } from 'next/router';
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import { Button } from '@vechaiui/button';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInPlayerState from '../../scripts/packets/PacketInPlayerState';
import PacketInUsernameChange from '../../scripts/packets/PacketInUsernameChange';
import PacketOutPlayerReadyState from '../../scripts/packets/PacketOutPlayerReadyState';
import LobbyPlayers from './LobbyPlayers';
import LobbyUsernameField from './LobbyUsernameField';
import MultiplayerGameplayPage from '../../pages/game/MultiplayerGameplayPage';
import PacketInStartGame from '../../scripts/packets/PacketInStartGame';
import PacketOutStartGame from '../../scripts/packets/PacketOutStartGame';
import PacketInPlayerReadyState from '../../scripts/packets/PacketInPlayerReadyState';
import { Player } from '../../types';
import GameSettings from './GameSettings';

const GameLobbyScreen: FunctionComponent<{
    gameSocket: GameSocket;
    username: string;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
    isOwner: boolean;
    initialSettingValues: Record<string, string> | undefined;
}> = ({
    gameSocket,
    username: selectedUsername,
    players,
    setPlayers,
    isOwner,
    initialSettingValues,
}) => {
    const router = useRouter();
    const { gameId } = router.query as { gameId: string };

    const [username, setUsername] = useState(selectedUsername);
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
        registerInitHandlers();
        startTheGame();
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
            {/* No longer need to force start games. */}
            {/* <div className="absolute p-3 left-0 bottom-0">
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
            </div> */}

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

            <GameSettings
                gameId={gameId}
                gameSocket={gameSocket}
                isOwner={isOwner}
                initialSettingValues={initialSettingValues}
            />
        </div>
    );
};

export default GameLobbyScreen;
