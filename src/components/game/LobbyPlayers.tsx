import { FunctionComponent, useEffect, useState } from 'react';
import { uid } from '../../scripts/miscellaneous/math';
import { Player } from '../../types';

const LobbyPlayers: FunctionComponent<{ players: Player[] }> = ({
    players,
}) => {
    const [playerSlots, setPlayerSlots] = useState(
        [] as (Player & { uid: string })[]
    );

    useEffect(() => {
        const usedSlots = players.map((p) => ({ ...p, uid: uid() }));

        const unusedSlots = Array(8 - usedSlots.length)
            .fill(0)
            .map(() => ({
                uid: uid(),
                username: '',
                ready: false,
            }));

        setPlayerSlots([...usedSlots, ...unusedSlots]);
    }, [players]);

    return (
        <div className="max-w-[39rem] flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl mb-8">Players</h1>
            <div className="flex flex-wrap justify-center items-center gap-3">
                {playerSlots.map((v) => (
                    <div
                        key={v.uid}
                        className={`h-36 w-36 px-2 py-1 pb-2 flex-shrink-0 flex flex-col justify-between ${
                            v.username.length === 0
                                ? 'bg-neutral-800'
                                : 'bg-neutral-700'
                        }`}
                    >
                        {v.username.length !== 0 && (
                            <>
                                <p className="truncate font-semibold">
                                    {v.username}
                                </p>
                                <div
                                    className={`self-end h-3 w-3 rounded-full ${
                                        v.ready ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LobbyPlayers;
