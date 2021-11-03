import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GameSocket from '../../scripts/game/GameSocket';
import BombImage from '../../../public/bomb-arrow.png';
import { uid } from '../../scripts/miscellaneous/math';
import { Player, RoundInfo } from '../../types';
import {
    Input,
} from '@vechaiui/forms';
import PacketInPlayerMessage from '../../scripts/packets/PacketInPlayerMessage';
import PacketOutPlayerMessage from '../../scripts/packets/PacketOutPlayerMessage';

const GameplayPage: NextPage<{
    gameSocket: GameSocket;
    players: Player[];
    roundInfo: RoundInfo;
    username: string;
    gameId: string;
}> = ({ gameSocket, players, roundInfo, username, gameId }) => {
    const [playerSlots, setPlayerSlots] = useState(
        [] as (Player & { uid: string })[]
    );
    const [curPlayerIndex, setCurPlayerIndex] = useState(0);
    const [word, setWord] = useState("" as string);

    const updateWord = async(e) => {
        gameSocket.fireAndForget(
            'update-word',
            new PacketOutPlayerMessage(
                gameId,
                username,
                e.target.value
            )
        );
    };

    useEffect(() => {
        // Set the beginning slots to the players.
        const usedSlots = players.map((p) => ({ ...p, uid: uid() }));

        // Add filler placeholder slots.
        const unusedSlots = Array(8 - usedSlots.length)
            .fill(0)
            .map(() => ({
                uid: uid(),
                username: '',
                ready: false,
            }));

        // Insert the bomb placeholder.
        usedSlots.splice(4, 0, { uid: uid(), username: '', ready: false });

        setPlayerSlots([...usedSlots, ...unusedSlots]);
    }, [players]);

    useEffect(() => {
        setCurPlayerIndex(
            playerSlots.findIndex((p) => p.username === roundInfo.username)
        );
    }, [roundInfo, playerSlots]);

    // subscribe to update-word once when component renders
    useEffect(() => {
        gameSocket.subscribe<PacketInPlayerMessage>(
            'update-word',
            (packet: { getMessage: () => string; getUsername: () => string }) => {
                console.log(packet.getMessage(), packet.getUsername());
                setWord(packet.getMessage());
            }
        );
    }, []);

    return (
        <div className="h-screen w-full flex justify-center items-center">
            <div className="relative flex justify-center items-center">
                <div
                    className="absolute"
                    style={{
                        transform: `rotate(${45 * curPlayerIndex}deg)`,
                    }}
                >
                    <Image src={BombImage} height={83} width={100} />
                </div>

                <div className="grid grid-cols-3 gap-24">
                    {playerSlots.map((p, i) => {
                        if (i === 4)
                            return (
                                <div
                                    key={uid()}
                                    className="h-32 w-32 bg-transparent"
                                />
                            );
                        return (
                            <div
                                key={p.uid}
                                className="h-32 w-32 bg-neutral-800 flex justify-center items-center"
                            >
                                <p className="font-semibold truncate">
                                    {p.username}
                                    {
                                        roundInfo.username == p.username &&
                                        <p>{word}</p>
                                    }
                                </p>
                            </div>
                        );
                    })}
                    {roundInfo.username === username &&
                        <Input
                            onChange={(e) => updateWord(e)}
                        />
                    } 
                </div>
            </div>
        </div>
    );
};

export default GameplayPage;
