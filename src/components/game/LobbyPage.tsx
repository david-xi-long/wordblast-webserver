import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInGameInfo from '../../scripts/packets/PacketInGameInfo';
import PacketInPlayerState from '../../scripts/packets/PacketInPlayerState';
import PacketOutGameJoin from '../../scripts/packets/PacketOutGameJoin';

const LobbyPage: FunctionComponent<{
    gameSocket: GameSocket;
    username: string;
}> = ({ gameSocket, username }) => {
    const router = useRouter();
    const { gameId } = router.query as { gameId: string };

    const [players, setPlayers] = useState([] as string[]);

    useEffect(() => {
        gameSocket
            .requestResponse<PacketInGameInfo>(
                'join-game',
                new PacketOutGameJoin(gameId, username)
            )
            .then(
                (packet) => {
                    setPlayers(packet.getPlayerNames());
                },
                () => {
                    // An exception occured while sending data to the game socket.
                    // Redirect to the main page, as the game is probably broken.
                    router.replace('/');
                }
            );

        gameSocket.subscribe<PacketInPlayerState>('player-state', (packet) => {
            if (!packet.getState()) {
                setPlayers(players.filter((p) => p !== packet.getUsername()));
            }
        });
    }, []);

    return (
        <div className="flex-container">
            <div className="game">
                {players.map((p) => (
                    <div key={p}>{p}</div>
                ))}
            </div>
            <div className="chatbox">Chat here</div>
        </div>
    );
};

export default LobbyPage;
