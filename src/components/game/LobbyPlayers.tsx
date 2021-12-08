import { BigHead } from '@bigheads/core';
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from 'react';
import PacketInPlayerReadyState from '../../scripts/packets/in/PacketInPlayerReadyState';
import PacketInUsernameChange from '../../scripts/packets/in/PacketInUsernameChange';
import GameSocket from '../../scripts/socket/GameSocket';
import { Player } from '../../types';
import Slots from '../utils/Slots';

const LobbyPlayers: FunctionComponent<{
    gameSocket: GameSocket;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
}> = ({ gameSocket, players, setPlayers }) => {
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
                        <BigHead />

                        {/* <p className="truncate font-semibold">
                            {player.username}
                        </p> */}
                        {/* <StateIndicator ready={player.ready} /> */}
                    </>
                )}
            />
        </div>
    );
};

export default LobbyPlayers;
