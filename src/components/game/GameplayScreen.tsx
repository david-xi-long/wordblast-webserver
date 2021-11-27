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

const GameplayPage: NextPage<{
    gameSocket: GameSocket;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
    roundInfo: RoundInfo;
    username: string;
    gameId: string;
}> = ({ gameSocket, players, setPlayers, roundInfo, username, gameId }) => {
    const [eliminated, setEliminated] = useState(false);
    const [word, setWord] = useState('');

    const registerInitHandlers = () => {
        gameSocket.subscribe<PacketInPlayerEliminated>(
            'player-eliminated',
            (packet) => {
                if (packet.getUsername() !== username) return;
                setEliminated(true);
            }
        );

        gameSocket.subscribe<PacketInDefinition>('definition', (packet) => {
            // alert("WORD:" + packet.getWord() + "Definition: " + packet.getDefinition());
        });
    };

    useEffect(() => {
        registerInitHandlers();
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
                    // TODO: Implement word being incorrect
                }
            });
    };

    return (
        <div className="p-8 pb-0 min-h-screen flex flex-col justify-center items-center">
            <div className="m-8 h-24 flex-shrink-0 flex flex-col justify-center items-center overflow-hidden">
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
                word={word}
                setWord={setWord}
            />

            <Input
                className="my-10 mx-8 game-input"
                style={{
                    visibility:
                        roundInfo.username === username ? 'initial' : 'hidden',
                }}
                value={word}
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
