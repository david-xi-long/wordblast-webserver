import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { Button } from '@mantine/core';
import GameSocket from '../../scripts/socket/GameSocket';
import PacketOutPlayerReadyState from '../../scripts/packets/out/PacketOutPlayerReadyState';
import LobbyPlayerSlots from './LobbyPlayerSlots';
import LobbyUsernameField from './LobbyUsernameField';
import { Player } from '../../types';
import GameCodeCard from './GameCodeCard';

const GameLobbyScreen: FunctionComponent<{
    gameUid: string;
    gameSid: string;
    gameSocket: GameSocket;
    username: string;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
}> = ({
    gameUid,
    gameSid,
    gameSocket,
    username: selectedUsername,
    players,
    setPlayers,
}) => {
    const [username, setUsername] = useState(selectedUsername);
    const [ready, setReady] = useState(false);

    const toggleReadyState = () => {
        const newState = !ready;

        setReady(newState);

        gameSocket.fireAndForget(
            'player-ready-state',
            new PacketOutPlayerReadyState(gameUid, username, newState)
        );
    };

    return (
        <div className="relative m-8 mb-0 min-h-[calc(100vh-2rem)] flex flex-col items-center">
            <div className="my-auto flex flex-col items-center">
                <LobbyPlayerSlots
                    gameSocket={gameSocket}
                    players={players}
                    setPlayers={setPlayers}
                />

                <Button
                    variant="filled"
                    color="primary"
                    onClick={toggleReadyState}
                    className="mt-8"
                >
                    {ready ? 'Unready' : 'Ready'}
                </Button>
            </div>

            <LobbyUsernameField
                gameUid={gameUid}
                gameSocket={gameSocket}
                username={username}
                setUsername={setUsername}
            />

            <GameCodeCard
                gameSid={gameSid}
                className="absolute left-0 bottom-0"
            />
        </div>
    );
};

export default GameLobbyScreen;
