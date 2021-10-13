import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInGameInfo from '../../scripts/packets/PacketInGameInfo';
import PacketInPlayerState from '../../scripts/packets/PacketInPlayerState';
import PacketOutGameJoin from '../../scripts/packets/PacketOutGameJoin';
import ChatRoom from './ChatRoom';
import LobbyUsernameField from './LobbyUsernameField';

const LobbyPage: FunctionComponent<{
    gameSocket: GameSocket;
    username: string;
}> = ({ gameSocket, username: selectedUsername }) => {
    const router = useRouter();
    const { gameId } = router.query as { gameId: string };

    const [username, setUsername] = useState(selectedUsername);
    const [players, setPlayers] = useState([] as string[]);

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

    const registerInitHandlers = () => {
        gameSocket.subscribe<PacketInPlayerState>('player-state', (packet) => {
            setPlayerState(packet.getUsername(), packet.getState());
        });
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
                    return;
                    // An exception occured while sending data to the game socket.
                    // Redirect to the main page, as the game is probably broken.
                    router.replace('/');
                }
            );
    };

    const playerPlaceholders = Array(8)
        .fill(0)
        .map(() => Math.random());

    // Run only once after the component has mounted.
    useEffect(() => {
        joinGame();
        registerInitHandlers();
    }, []);

    return (
        <div className="h-screen">
            <div className="h-full flex flex-col justify-center items-center">
                <div className="my-auto">
                    <h1 className="font-bold text-3xl mb-3">Players</h1>
                    <div className="grid grid-cols-4 gap-3">
                        {playerPlaceholders.map((v) => (
                            <div key={v} className="h-24 w-24 bg-neutral-700" />
                        ))}
                    </div>
                </div>
                <LobbyUsernameField
                    gameId={gameId}
                    gameSocket={gameSocket}
                    username={username}
                    setUsername={setUsername}
                />
            </div>
            <ChatRoom
                username={username}
                gameSocket={gameSocket}
                gameId={gameId}
            />
        </div>
    );
};

export default LobbyPage;
