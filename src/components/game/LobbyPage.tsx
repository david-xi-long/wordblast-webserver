import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInGameInfo from '../../scripts/packets/PacketInGameInfo';
import PacketInPlayerState from '../../scripts/packets/PacketInPlayerState';
import PacketOutGameJoin from '../../scripts/packets/PacketOutGameJoin';
import ChatRoom from './ChatRoom'

const LobbyPage: FunctionComponent<{
    gameSocket: GameSocket;
    username: string;
}> = ({ gameSocket, username }) => {
    const router = useRouter();
    const { gameId } = router.query as { gameId: string };

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
                    // An exception occured while sending data to the game socket.
                    // Redirect to the main page, as the game is probably broken.
                    router.replace('/');
                }
            );
    };

    // Run only once after the component has mounted.
    useEffect(() => {
        joinGame();
        registerInitHandlers();
    }, []);

    return (
        <div className="flex-container">
            <div className="game">
                {players.map((p) => (
                    <div key={p}>{p}</div>
                ))}
            </div>
            <ChatRoom username={username} gameSocket={gameSocket} gameId={gameId}/>
        </div>
    );
};

export default LobbyPage;
