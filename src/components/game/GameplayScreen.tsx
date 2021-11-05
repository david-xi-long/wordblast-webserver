import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Input } from '@vechaiui/forms';
import GameSocket from '../../scripts/game/GameSocket';
import BombImage from '../../../public/bomb-arrow.png';
import { uid } from '../../scripts/miscellaneous/math';
import { Player, RoundInfo } from '../../types';
import PacketInPlayerMessage from '../../scripts/packets/PacketInPlayerMessage';
import PacketOutPlayerMessage from '../../scripts/packets/PacketOutPlayerMessage';
import PacketOutCheckWord from '../../scripts/packets/PacketOutCheckWord';
import PacketInCheckWord from '../../scripts/packets/PacketInCheckWord';

const rotationIndexPositions = {
    0: 0,
    1: 1,
    2: 2,
    3: 7,
    5: 3,
    6: 6,
    7: 5,
    8: 4,
};

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
    const [word, setWord] = useState('' as string);

    const updateWord = async (e) => {
        gameSocket.fireAndForget(
            'update-word',
            new PacketOutPlayerMessage(gameId, username, e.target.value)
        );
    };

    useEffect(() => {
        // Set the beginning slots to the players.
        const usedSlots = players.map((p) => ({ uid: uid(), ...p }));

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
            rotationIndexPositions[
                playerSlots.findIndex((p) => p.username === roundInfo.username)
            ]
        );
        setWord('');
    }, [roundInfo, playerSlots]);

    //input field should be uppercase only
    const toInputUppercase = (e) => {
        e.target.value = ('' + e.target.value).toUpperCase();
    };

    // subscribe to update-word once when component renders
    useEffect(() => {
        gameSocket.subscribe<PacketInPlayerMessage>(
            'update-word',
            (packet: {
                getMessage: () => string;
                getUsername: () => string;
            }) => {
                console.log(packet.getMessage(), packet.getUsername());
                setWord(packet.getMessage());
            }
        );
    }, []);

    const sendMessage = (e) => {
        if (e.keyCode == 13) {
            console.log('submitting word:', word);
            gameSocket
                .requestResponse<PacketInCheckWord>(
                    'check-word',
                    new PacketOutCheckWord(word, gameId)
                )
                .then(
                    (packet) => {
                        if (packet.isValid() == true) {
                            // Implement word being correct
                            console.log('Word is valid');
                        } else {
                            // Implement word being incorrect
                            console.log('Word is not valid');
                        }
                    },
                    () => {
                        // Something has gone wrong where packet was not received
                        console.log('packet was not received');
                    }
                );
        }
    };

    return (
        <div className="relative h-screen flex justify-center items-center">
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
                                key={p.uid}
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
                                {roundInfo.username == p.username && (
                                    <p>{word}</p>
                                )}
                            </p>
                        </div>
                    );
                })}
            </div>
            {roundInfo.username === username && (
                <>
                    <div style={{ position: 'absolute', bottom: 25 }}>
                        <Input
                            className="game-input"
                            onKeyDown={(e) => sendMessage(e)}
                            onChange={(e) => updateWord(e)}
                            onInput={toInputUppercase}
                        />
                    </div>
                    <div
                        style={{ position: 'absolute', top: 25, fontSize: 60 }}
                    >
                        IT IS YOUR TURN
                    </div>
                </>
            )}
        </div>
    );
};

export default GameplayPage;
