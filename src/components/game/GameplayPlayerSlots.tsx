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
const Word: FunctionComponent<{ word: string; letterCombo: string }> = ({
    word,
    letterCombo,
}) => {
    const wordArray = word.split('');
    const sIndex = word.indexOf(letterCombo.toString());
    const eIndex = sIndex == -1 ? -1 : sIndex + letterCombo.length;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            {wordArray.map((w, i) => {
                if (i == word.length - 1 && word.length == eIndex) return <div className="fly-in lightgreen" key={Math.random()}>{w}</div>;
                if (i == word.length - 1) return <div className="fly-in" key={Math.random()}>{w}</div>;
                if (sIndex === -1) return <div key={Math.random()}>{w}</div>;
                if (i >= sIndex && i < eIndex)
                    return (
                        <div key={Math.random()} className="lightgreen">
                            {w}
                        </div>
                    );
                return <div key={Math.random()}>{w}</div>;
            })}
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
                <div className="font-semibold truncate center">
                    {player.username}

                    <p>Lives: {player.lives}</p>

                    {roundInfo.username === player.username && (
                        <Word word={word} letterCombo={roundInfo.letterCombo} />
                    )}
                </div>
            )}
        />
    );
};

export default GameplayPlayerSlots;
