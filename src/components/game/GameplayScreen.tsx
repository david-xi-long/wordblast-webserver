import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Input } from '@vechaiui/forms';
import GameSocket from '../../scripts/game/GameSocket';
import BombImage from '../../../public/Bomb.png';
import Arrow from '../../../public/arrow.png';
import { uid } from '../../scripts/miscellaneous/math';
import { Player, RoundInfo } from '../../types';
import PacketInPlayerMessage from '../../scripts/packets/PacketInPlayerMessage';
import PacketOutPlayerMessage from '../../scripts/packets/PacketOutPlayerMessage';
import PacketOutCheckWord from '../../scripts/packets/PacketOutCheckWord';
import PacketInCheckWord from '../../scripts/packets/PacketInCheckWord';
import PacketInPlayerEliminated from '../../scripts/packets/PacketInPlayerEliminated';

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
    const [timeLeft, setTimeLeft] = useState(1);
    const [eliminated, setEliminated] = useState(false);

    // I was too tired to figure out how to actually send a map over so I did it this way. It's ugly, I know.
    let playerList = roundInfo.players;
    let playerLives = roundInfo.playerLives;
    let playerMap = new Map();
    for (let i = 0; i < playerList.length; i++) {
        playerMap.set(playerList[i], playerLives[i]);
    }

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
    }, [roundInfo, playerSlots]);

    // set timer each with each new round
    useEffect(() => {
        setWord('');
        // delay to allow 'out of time' message
        setTimeout(() => {}, 1000);
        setTimeLeft(Math.round(roundInfo.timeRemaining / 1000) - 1);
    }, [roundInfo]);

    // input field should be uppercase only
    const toInputUppercase = (e) => {
        e.target.value = ('' + e.target.value).toUpperCase();
    };

    // subscribe to update-word once when component renders
    useEffect(() => {
        gameSocket.subscribe<PacketInPlayerMessage>('update-word', (packet) => {
            setWord(packet.getMessage());
        });

        gameSocket.subscribe<PacketInPlayerEliminated>(
            'player-eliminated',
            (packet) => {
                if (packet.getUsername() !== username) return;
                setEliminated(true);
            }
        );

        // decrement the timer
        setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft((time) => time - 1);
            }
        }, 1000);
    }, []);

    const sendWordGuess = (guess: string) => {
        gameSocket
            .requestResponse<PacketInCheckWord>(
                'check-word',
                new PacketOutCheckWord(guess, gameId)
            )
            .then((packet) => {
                if (packet.isValid()) {
                    // TODO: Implement word being correct
                } else {
                    // TODO: Implement word being incorrect
                }
            });
    };

    return (
        <div className="p-8 relative h-screen flex justify-center items-center">
            <div className="absolute">
                <div
                    style={{
                        transform: `rotate(${45 * curPlayerIndex - 45}deg)`,
                        transition: '300ms ease all',
                        textAlign: 'center',
                        zIndex: -1,
                    }}
                >
                    <Image src={Arrow} height={300} width={30} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-24">
                {playerSlots.map((p, i) => {
                    if (i === 4)
                        return (
                            <div
                                key={p.uid}
                                className="h-32 w-32 bg-transparent"
                            >
                                <div
                                    style={{
                                        textAlign: 'center',
                                        paddingLeft: '15px',
                                        paddingTop: '15px',
                                    }}
                                >
                                    <Image
                                        src={BombImage}
                                        height={150}
                                        width={150}
                                    />
                                </div>
                                <div
                                    style={{
                                        textAlign: 'center',
                                        position: 'absolute',
                                    }}
                                >
                                    <div>time left: {timeLeft}</div>
                                    <div>
                                        Current Combo: {roundInfo.letterCombo}
                                    </div>
                                </div>
                            </div>
                        );
                    if (p.username === '')
                        return (
                            <div
                                key={p.uid}
                                className="h-32 w-32 bg-neutral-800 flex justify-center items-center"
                            >
                                <p className="font-semibold truncate"></p>
                            </div>
                        );
                    return (
                        <div
                            key={p.uid}
                            className="h-32 w-32 bg-neutral-800 flex justify-center items-center"
                        >
                            <p className="font-semibold truncate">
                                {p.username}
                                <p> Lives: {playerMap.get(p.username)}</p>
                                {roundInfo.username == p.username && (
                                    <p>
                                        <Word
                                            word={word}
                                            letterCombo={roundInfo.letterCombo}
                                        />
                                    </p>
                                )}
                            </p>
                        </div>
                    );
                })}
            </div>
            {roundInfo.username === username && timeLeft > 0 && (
                <>
                    <div style={{ position: 'absolute', bottom: 25 }}>
                        <Input
                            className="game-input"
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') return;
                                sendWordGuess(e.currentTarget.value);
                            }}
                            onChange={(e) => updateWord(e)}
                            onInput={toInputUppercase}
                        />
                    </div>
                    <div
                        style={{ position: 'absolute', top: 25, fontSize: 45 }}
                    >
                        IT IS YOUR TURN
                    </div>
                </>
            )}
            {timeLeft <= 0 && roundInfo.username === username && (
                <div style={{ position: 'absolute', top: 25, fontSize: 45 }}>
                    OUT OF TIME!, -1 LIFE
                </div>
            )}
            {roundInfo.previousPlayer === username &&
                roundInfo.username != username && (
                    <div
                        style={{ position: 'absolute', top: 25, fontSize: 30 }}
                    >
                        {roundInfo.notificationText}
                    </div>
                )}
        </div>
    );
};

//maps out the word the current player is typing character by character and
//colors in the letter combination green.
function Word(props) {
    const wordArray = [...props.word];
    const sIndex = props.word.indexOf(props.letterCombo.toString());
    const eIndex = sIndex + props.letterCombo.length;
    console.log(sIndex, eIndex, props.letterCombo);
    return (
        <div style={{ display: 'flex' }}>
            {wordArray.map((w, i) => {
                if (sIndex == -1) return <p>{w}</p>;
                else if (i >= sIndex && i < eIndex)
                    return <p style={{ color: 'lightgreen' }}>{w}</p>;
                else return <p>{w}</p>;
            })}
        </div>
    );
}

export default GameplayPage;
