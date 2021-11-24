import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Input } from '@vechaiui/forms';
import GameSocket from '../../scripts/socket/GameSocket';
import { Player, RoundInfo } from '../../types';
import PacketInPlayerMessage from '../../scripts/packets/in/PacketInPlayerMessage';
import PacketOutPlayerMessage from '../../scripts/packets/out/PacketOutPlayerMessage';
import PacketOutCheckWord from '../../scripts/packets/out/PacketOutCheckWord';
import PacketInCheckWord from '../../scripts/packets/in/PacketInCheckWord';
import PacketInPlayerEliminated from '../../scripts/packets/in/PacketInPlayerEliminated';
import PacketInDefinition from '../../scripts/packets/in/PacketInDefinition';
import CircleSlots from '../utils/CircleSlots';
import Bomb from './Bomb';

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

// maps out the word the current player is typing character by character and
// colors in the letter combination green.
function Word(props) {
    const { word, letterCombo } = props;
    const wordArray = [...word];
    const sIndex = word.indexOf(letterCombo.toString());
    const eIndex = sIndex + letterCombo.length;

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {wordArray.map((w, i) => {
                if (sIndex === -1) return <p key={Math.random()}>{w}</p>;

                if (i >= sIndex && i < eIndex)
                    return (
                        <p key={Math.random()} style={{ color: 'lightgreen' }}>
                            {w}
                        </p>
                    );

                return <p key={Math.random()}>{w}</p>;
            })}
        </div>
    );
}

const GameplayPage: NextPage<{
    gameSocket: GameSocket;
    players: Player[];
    roundInfo: RoundInfo;
    username: string;
    gameId: string;
}> = ({ gameSocket, players, roundInfo, username, gameId }) => {
    const [curPlayerIndex, setCurPlayerIndex] = useState(0);
    const [word, setWord] = useState('' as string);
    const [timeLeft, setTimeLeft] = useState(1);
    const [eliminated, setEliminated] = useState(false);

    // I was too tired to figure out how to actually send a map over so I did it this way. It's ugly, I know.
    // TODO: Map<String, Integer> -> { [playerName: string]: number }
    const playerList = roundInfo.players;
    const { playerLives } = roundInfo;
    const playerMap = new Map();
    for (let i = 0; i < playerList.length; i += 1) {
        playerMap.set(playerList[i], playerLives[i]);
    }

    const updateWord = async (e) => {
        gameSocket.fireAndForget(
            'update-word',
            new PacketOutPlayerMessage(gameId, username, e.target.value)
        );
    };

    useEffect(() => {
        setCurPlayerIndex(
            rotationIndexPositions[
                players.findIndex((p) => p.username === roundInfo.username)
            ]
        );
    }, [roundInfo, players]);

    // set timer each with each new round
    useEffect(() => {
        setWord('');
        // delay to allow 'out of time' message
        setTimeout(() => {}, 1000);
        setTimeLeft(Math.round(roundInfo.timeRemaining / 1000) - 1);
    }, [roundInfo]);

    useEffect(() => {
        gameSocket.subscribe<PacketInPlayerEliminated>(
            'player-eliminated',
            (packet) => {
                if (packet.getUsername() !== username) return;
                setEliminated(true);
            }
        );

        gameSocket.subscribe<PacketInPlayerMessage>('update-word', (packet) => {
            setWord(packet.getMessage());
        });

        gameSocket.subscribe<PacketInDefinition>('definition', (packet) => {
            // alert("WORD:" + packet.getWord() + "Definition: " + packet.getDefinition());
        });

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
                    console.log('word', guess, 'is valid');
                    // TODO: Implement word being correct
                } else {
                    console.log('word', guess, 'is invalid');
                    setWord('');
                    // TODO: Implement word being incorrect
                }
            });
    };

    return (
        <div className="p-8 h-screen flex justify-center items-center">
            <CircleSlots
                middle={
                    <Bomb
                        deg={45 * curPlayerIndex - 45}
                        combo={roundInfo.letterCombo}
                        timeLeft={timeLeft}
                    />
                }
                items={players.map((p) => ({ uid: p.username, ...p }))}
                map={(player) => (
                    <div className="font-semibold truncate center">
                        {player.username}
                        <p>Lives: {playerMap.get(player.username)}</p>
                        {roundInfo.username === player.username && (
                            <Word
                                word={word}
                                letterCombo={roundInfo.letterCombo}
                            />
                        )}
                    </div>
                )}
            />

            {roundInfo.username === username && timeLeft > 0 && (
                <>
                    <div style={{ position: 'absolute', bottom: 25 }}>
                        <Input
                            value={word}
                            className="game-input"
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') return;
                                sendWordGuess(e.currentTarget.value);
                            }}
                            onChange={(e) => updateWord(e)}
                            onInput={(e) => {
                                e.currentTarget.value =
                                    `${e.currentTarget.value}`.toUpperCase();
                            }}
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
                roundInfo.username !== username && (
                    <div
                        style={{ position: 'absolute', top: 25, fontSize: 30 }}
                    >
                        {roundInfo.notificationText}
                    </div>
                )}
        </div>
    );
};

export default GameplayPage;
