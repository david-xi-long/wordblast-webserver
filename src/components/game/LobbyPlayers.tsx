import { Dispatch, FunctionComponent, SetStateAction, useEffect } from 'react';
import PacketInPlayerReadyState from '../../scripts/packets/in/PacketInPlayerReadyState';
import PacketInPlayerState from '../../scripts/packets/in/PacketInPlayerState';
import PacketInUsernameChange from '../../scripts/packets/in/PacketInUsernameChange';
import GameSocket from '../../scripts/socket/GameSocket';
import { Player } from '../../types';
import Slots from '../utils/Slots';
import StateIndicator from '../utils/StateIndicator';

const LobbyPlayers: FunctionComponent<{
    gameSocket: GameSocket;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
}> = ({ gameSocket, players, setPlayers }) => {
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

    useEffect(() => {
        registerInitHandlers();
    }, []);

    return (
        <div className="max-w-[39rem] flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl mb-8">Players</h1>
            <Slots
                items={players.map((p) => ({ uid: p.username, ...p }))}
                map={(player) => (
                    <>
                        <p className="truncate font-semibold">
                            {player.username}
                        </p>
                        <StateIndicator ready={player.ready} />
                    </>
                )}
            />
        </div>
    );
};

export default LobbyPlayers;
