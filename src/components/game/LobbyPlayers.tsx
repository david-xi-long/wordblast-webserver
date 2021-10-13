import { FunctionComponent, useEffect, useState } from 'react';
import { uid } from '../../scripts/miscellaneous/math';

const LobbyPlayers: FunctionComponent<{ players: string[] }> = ({
    players,
}) => {
    const [playerSlots, setPlayerSlots] = useState(
        [] as { uid: string; username: string }[]
    );

    useEffect(() => {
        const usedSlots = players.map((p) => ({
            uid: uid(),
            username: p,
        }));

        const unusedSlots = Array(8 - usedSlots.length)
            .fill(0)
            .map(() => ({
                uid: uid(),
                username: '',
            }));

        setPlayerSlots([...usedSlots, ...unusedSlots]);
    }, [players]);

    return (
        <>
            <h1 className="font-bold text-3xl mb-3">Players</h1>
            <div className="grid grid-cols-4 gap-3">
                {playerSlots.map((v) => (
                    <div
                        key={v.uid}
                        className={`h-36 w-36 px-2 py-1 ${
                            v.username.length === 0
                                ? 'bg-neutral-800'
                                : 'bg-neutral-700'
                        }`}
                    >
                        <p className="truncate font-semibold">{v.username}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default LobbyPlayers;
