import { BigHead } from '@bigheads/core';
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import PacketInLivesChange from '../../scripts/packets/in/PacketInLivesChange';
import PacketInPlayerMessage from '../../scripts/packets/in/PacketInPlayerMessage';
import GameSocket from '../../scripts/socket/GameSocket';
import { Player, RoundInfo } from '../../types';
import Heart from '../icons/Heart';
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
const Word: FunctionComponent<{
    word: string;
    letterCombo: string;
    hidden: boolean;
}> = ({ word, letterCombo, hidden }) => {
    const wordArray = word.split('');
    const sIndex = word.indexOf(letterCombo.toString());
    const eIndex = sIndex === -1 ? -1 : sIndex + letterCombo.length;

    return (
        <div
            style={{
                visibility: hidden ? 'hidden' : 'initial',
                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
            className="truncate"
        >
            {wordArray.map((w, i) => (
                <div
                    className={`
                        ${i === word.length - 1 ? 'fly-in' : ''}
                        ${i >= sIndex && i < eIndex ? 'lightgreen' : ''}
                    `}
                    key={Math.random()}
                >
                    {w}
                </div>
            ))}
            {' '}
        </div>
    );
};

const GameplayPlayerSlots: FunctionComponent<{
    roundInfo: RoundInfo;
    gameSocket: GameSocket;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
    word: string;
    setWord: Dispatch<SetStateAction<string>>;
}> = ({ roundInfo, gameSocket, players, setPlayers, word, setWord }) => {
    const [curPlayerIndex, setCurPlayerIndex] = useState(0);

    useEffect(() => {
        setWord('');
    }, [roundInfo]);

    useEffect(() => {
        setCurPlayerIndex(
            rotationIndexPositions[
                players.findIndex((p) => p.username === roundInfo.username)
            ]
        );
    }, [roundInfo, players]);

    const registerInitHandlers = () => {
        gameSocket.subscribe<PacketInPlayerMessage>('update-word', (packet) => {
            setWord(packet.getMessage());
        });
    };

    useEffect(() => {
        registerInitHandlers();
    }, []);

    return (
        <CircleSlots
            middle={
                <Bomb
                    deg={45 * curPlayerIndex - 45}
                    combo={roundInfo.letterCombo}
                />
            }
            items={players.map((p) => ({ uid: p.username, ...p }))}
            map={(player) => (
                <div className="flex flex-col items-center truncate">
                    <span className="inline-block h-24 w-24 mb-1">
                        <BigHead {...player.bigHeadOptions} />
                    </span>

                    <span className="inline-block h-5">
                        {Array(player.lives)
                            .fill(0)
                            .map(() => (
                                <Heart
                                    key={Math.random()}
                                    height="h-5"
                                    width="w-5"
                                    color="text-red-400"
                                />
                            ))}
                    </span>

                    <p className="mt-0.5 text-neutral-300 font-semibold text-sm truncate">
                        {player.username}
                    </p>

                    <Word
                        word={word}
                        letterCombo={roundInfo.letterCombo}
                        hidden={roundInfo.username !== player.username}
                    />
                </div>
            )}
        />
    );
};

export default GameplayPlayerSlots;
