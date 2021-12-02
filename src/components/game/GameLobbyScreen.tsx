import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { Button } from '@mantine/core';
import GameSocket from '../../scripts/socket/GameSocket';
import PacketOutPlayerReadyState from '../../scripts/packets/out/PacketOutPlayerReadyState';
import LobbyPlayerSlots from './LobbyPlayerSlots';
import LobbyUsernameField from './LobbyUsernameField';
import { Player } from '../../types';

const GameLobbyScreen: FunctionComponent<{
    gameId: string;
    gameSocket: GameSocket;
    username: string;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
}> = ({
    gameId,
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
            new PacketOutPlayerReadyState(gameId, username, newState)
        );
    };

    return (
        <div className="p-8 pb-0 min-h-screen flex flex-col items-center">
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
                gameId={gameId}
                gameSocket={gameSocket}
                username={username}
                setUsername={setUsername}
            />
        </div>
    );
};

export default GameLobbyScreen;
