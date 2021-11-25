import { NextPage } from 'next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Input } from '@vechaiui/forms';
import GameSocket from '../../scripts/socket/GameSocket';
import { Player, RoundInfo } from '../../types';
import PacketOutPlayerMessage from '../../scripts/packets/out/PacketOutPlayerMessage';
import PacketOutCheckWord from '../../scripts/packets/out/PacketOutCheckWord';
import PacketInCheckWord from '../../scripts/packets/in/PacketInCheckWord';
import PacketInPlayerEliminated from '../../scripts/packets/in/PacketInPlayerEliminated';
import PacketInDefinition from '../../scripts/packets/in/PacketInDefinition';
import Countdown from './Countdown';
import GameplayPlayerSlots from './GameplayPlayerSlots';

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
    setPlayers: Dispatch<SetStateAction<Player[]>>;
    roundInfo: RoundInfo;
    username: string;
    gameId: string;
<<<<<<< HEAD
}> = ({ gameSocket, players, setPlayers, roundInfo, username, gameId }) => {
    const [eliminated, setEliminated] = useState(false);

    const registerInitHandlers = () => {
=======
<<<<<<< HEAD
}> = ({ gameSocket, players, setPlayers, roundInfo, username, gameId }) => {
    const [eliminated, setEliminated] = useState(false);

    const registerInitHandlers = () => {
=======
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
>>>>>>> fc3dee96e59c682db9f78b449654008a917e8a12
>>>>>>> 106f1b1451907ab985d143ed13f83e594ab112e8
        gameSocket.subscribe<PacketInPlayerEliminated>(
            'player-eliminated',
            (packet) => {
                if (packet.getUsername() !== username) return;
                setEliminated(true);
            }
        );

<<<<<<< HEAD
=======
<<<<<<< HEAD
        gameSocket.subscribe<PacketInDefinition>('definition', (packet) => {
            // alert("WORD:" + packet.getWord() + "Definition: " + packet.getDefinition());
        });
    };

    useEffect(() => {
        registerInitHandlers();
=======
        gameSocket.subscribe<PacketInPlayerMessage>('update-word', (packet) => {
            setWord(packet.getMessage());
        });

>>>>>>> 106f1b1451907ab985d143ed13f83e594ab112e8
        gameSocket.subscribe<PacketInDefinition>('definition', (packet) => {
            // alert("WORD:" + packet.getWord() + "Definition: " + packet.getDefinition());
        });
    };

<<<<<<< HEAD
    useEffect(() => {
        registerInitHandlers();
=======
        // decrement the timer
        setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft((time) => time - 1);
            }
        }, 1000);
>>>>>>> fc3dee96e59c682db9f78b449654008a917e8a12
>>>>>>> 106f1b1451907ab985d143ed13f83e594ab112e8
    }, []);

    const updateWord = async (e) => {
        gameSocket.fireAndForget(
            'update-word',
            new PacketOutPlayerMessage(gameId, username, e.target.value)
        );
    };

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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
                    setWord('');
>>>>>>> fc3dee96e59c682db9f78b449654008a917e8a12
>>>>>>> 106f1b1451907ab985d143ed13f83e594ab112e8
                    // TODO: Implement word being incorrect
                }
            });
    };

    return (
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 106f1b1451907ab985d143ed13f83e594ab112e8
        <div className="p-8 pb-0 h-screen flex flex-col justify-center items-center">
            <div className="m-8 mb-16 h-24 flex flex-col justify-center items-center overflow-hidden">
                <p className="text-4xl font-bold">
                    {roundInfo.username === username && <>IT IS YOUR TURN</>}
                    {roundInfo.previousPlayer === username &&
                        roundInfo.username !== username &&
                        roundInfo.notificationText}
                </p>
            </div>

            <GameplayPlayerSlots
                gameSocket={gameSocket}
                roundInfo={roundInfo}
                players={players}
                setPlayers={setPlayers}
<<<<<<< HEAD
=======
            />

            <Input
                className="mx-8 mt-16 mb-12 game-input"
                style={{
                    visibility:
                        roundInfo.username === username ? 'initial' : 'hidden',
                }}
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

            <Countdown roundInfo={roundInfo} />
=======
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
>>>>>>> 106f1b1451907ab985d143ed13f83e594ab112e8
            />

            <Input
                className="mx-8 mt-16 mb-12 game-input"
                style={{
                    visibility:
                        roundInfo.username === username ? 'initial' : 'hidden',
                }}
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

            <Countdown roundInfo={roundInfo} />
        </div>
    );
};

export default GameplayPage;
