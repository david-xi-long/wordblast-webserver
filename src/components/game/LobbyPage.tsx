import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInGameInfo from '../../scripts/packets/PacketInGameInfo';
import PacketInPlayerState from '../../scripts/packets/PacketInPlayerState';
import PacketInUsernameChange from '../../scripts/packets/PacketInUsernameChange';
import PacketOutGameJoin from '../../scripts/packets/PacketOutGameJoin';
import ChatRoom from './ChatRoom';
import LobbyPlayers from './LobbyPlayers';
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
                    return;
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
        <div className="h-screen">
            <div className="h-full flex flex-col justify-center items-center">
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
            <ChatRoom
                username={username}
                gameSocket={gameSocket}
                gameId={gameId}
            />
        </div>
    );
};

export default LobbyPage;
