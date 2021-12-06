import { BigHead } from '@bigheads/core';
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from 'react';
import PacketInPlayerReadyState from '../../scripts/packets/in/PacketInPlayerReadyState';
import PacketInUsernameChange from '../../scripts/packets/in/PacketInUsernameChange';
import GameSocket from '../../scripts/socket/GameSocket';
import { Player } from '../../types';
import Slots from '../utils/Slots';
import StateIndicator from '../utils/StateIndicator';

const calcLevel = (experience: number, base = 250, exponent = 1.25) =>
    Math.floor((experience / base) ** (1 / exponent));

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
                    <div className="flex items-center space-x-2">
                        <span className="inline-block h-24 w-24 flex-shrink-0">
                            <BigHead {...player.bigHeadOptions} mask={false} />
                        </span>

                        <div className="truncate">
                            <h2 className="text-neutral-300 text-base font-semibold truncate">
                                {player.username}
                            </h2>

                            <div className="flex justify-between items-center space-x-2">
                                <p className="text-neutral-400 text-sm font-semibold truncate">
                                    Level {calcLevel(player.experience)}
                                </p>

                                <StateIndicator ready={player.ready} />
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default LobbyPlayers;
