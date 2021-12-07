/*import { Alert } from '@vechaiui/alert';
import { Button } from '@vechaiui/button';
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    RequiredIndicator,
} from '@vechaiui/forms';
import router, { useRouter } from 'next/router';
import {
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useState,
    useEffect,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import GameSocket from '../../scripts/socket/GameSocket';
import PacketInCheckWord from '../../scripts/packets/in/PacketInCheckWord';
import PacketOutCheckWord from '../../scripts/packets/out/PacketOutCheckWord';
import PacketOutPlayerMessage from '../../scripts/packets/out/PacketOutPlayerMessage';
import Image from 'next/image';
import AvatarPlaceholder from '../../../public/AvatarPlaceholder.png';
import BombPlaceholder from '../../../public/Bomb.png';
import RightArrowPlaceholder from '../../../public/arrows/RightArrowPlaceholder.png';
import next from 'next';
import PacketOutNextTurn from '../../scripts/packets/out/PacketOutNextTurn';
import PacketInNextTurn from '../../scripts/packets/in/PacketInNextTurn';
import PacketInPlayerState from '../../scripts/packets/in/PacketInPlayerState';
import { Player } from '../../types';
//import Timer from './Timer';

const MultiplayerGameplayPage: FunctionComponent<{
    players: Player[];
    gameSocket: GameSocket;
    username: string;
}> = ({ players, gameSocket, username }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [wordIsValid, setWordIsValid] = useState(true);
    const [correctInput, setCorrectInput] = useState(true);
    const [outOfTime, setOutOfTime] = useState(true);
    const [goNextTurn, setGoNextTurn] = useState(false);
    const router = useRouter();
    const { gameId } = router.query as { gameId: string };
    var playerLoc = players.indexOf(username);
    var currentPlayer = 0;
    var timeToAnswer = 1;
    var lives = 3;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submit = async ({ inputWord }: { inputWord: string }) => {
        setIsLoading(true);
        gameSocket
            .requestResponse<PacketInCheckWord>(
                'check-word',
                new PacketOutCheckWord(inputWord, gameId)
            )
            .then(
                (packet) => {
                    if (packet.wordIsValid() == true) {
                        // Implement word being correct
                        console.log('Word is valid');
                        setCorrectInput(true);
                        router.replace('/sucess');
                    } else {
                        // Implement word being incorrect
                        setWordIsValid(false);
                        //router.replace("/failure");
                        router.reload();
                    }
                },
                () => {
                    // Something has gone wrong where packet was not received
                    router.replace('/');
                }
            );
    };

    const nextTurn = () => {
        gameSocket.subscribe<PacketInNextTurn>(
            'next-turn',
            (packet: { getLetterCombo: () => any }) => {
                setGoNextTurn(true);
                let letterCombo = packet.getLetterCombo();
                let element = document.getElementById('A' + currentPlayer);
                if (element != null) {
                    element.style.visibility = 'hidden';
                }
                currentPlayer = currentPlayer + 1;
                if (currentPlayer == players.length) {
                    currentPlayer = 0;
                }
                element = document.getElementById('A' + currentPlayer);
                if (element != null) {
                    element.style.visibility = 'visible';
                }
                const form = document.getElementById(
                    'inputForm'
                ) as HTMLInputElement;
                const button = document.getElementById(
                    'inputButton'
                ) as HTMLInputElement;
                if (form != null) {
                    if (playerLoc != currentPlayer) {
                        form.disabled = true;
                        button.disabled = true;
                    } else {
                        form.disabled = false;
                        button.disabled = false;
                    }
                }
                let timeleft = timeToAnswer;
                const testTimer = setInterval(() => {
                    element = document.getElementById('Timer');
                    if (element != null) {
                        if (timeleft <= 0) {
                            clearInterval(testTimer);
                            element.innerHTML = 'Finished';
                            if (playerLoc === currentPlayer) {
                                gameSocket.fireAndForget(
                                    'next-turn',
                                    new PacketOutNextTurn(gameId, outOfTime)
                                );
                                alert('Ran out of time!');
                                lives--;
                                const livesElement =
                                    document.getElementById('lives');
                                if (livesElement != null) {
                                    livesElement.innerHTML = `Lives remaining: ${lives}`;
                                }
                            }
                        } else {
                            element.innerHTML = `${timeleft}  seconds remaining`;
                        }
                        timeleft -= 1;
                    }
                }, 1000);
            }
        );
    };

    //update text for everyone as a player is typing a word
    const updateWord = async (e) => {
        console.log(username, e.target.value);
        // gameSocket.fireAndForget('update-word', new PacketOutPlayerMessage(gameId, username, e));
    };

    const sendNextTurnRequest = async () => {
        gameSocket.fireAndForget(
            'next-turn',
            new PacketOutNextTurn(gameId, outOfTime)
        );
    };
    const players_readied_up = async () => {
        gameSocket.requestResponse(
            'readied',
            new PacketInPlayerState('active', true)
        );
    };
    //Dynamic players Readied up from the Web socket will be attached this variable below
    const players_readied_upp = 2;

    useEffect(() => {
        nextTurn();
    }, []);
    if (players.length == players_readied_upp) {
        return (
            <>
                <div>
                    <Button
                        border="none"
                        color="pink"
                        height="200px"
                        onClick={() => console.log('Start Game!')}
                        radius="50%"
                        width="200px"
                        children="I'm a pink circle!"
                    />
                </div>
            </>
        );
    }
    return (
        <>
            <div>
                <form onSubmit={handleSubmit(submit)}>
                    {!wordIsValid && (
                        <Alert variant="subtle"> That word is invalid.</Alert>
                    )}
                    <FormControl
                        id="inputWord"
                        invalid={errors.input !== undefined}
                    >
                        <FormLabel>Input</FormLabel>
                        <Input
                            id="inputForm"
                            type="inputWord"
                            {...register('inputWord', { required: true })}
                            onChange={(e) => updateWord(e)}
                        />
                        {errors.inputWord?.type == 'required' && (
                            <FormErrorMessage>
                                Input must not be blank.
                            </FormErrorMessage>
                        )}
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            id="inputButton"
                        >
                            Submit Input
                        </Button>
                    </FormControl>
                </form>
            </div>
            <div id="lives">Lives Remaining: {lives}</div>
            <div className="player_container">
                <div className="P1">
                    {players[0]}
                    <Image src={AvatarPlaceholder} width={100} height={100} />
                </div>
                <div className="P2">
                    {players[1]}
                    <Image src={AvatarPlaceholder} width={100} height={100} />
                </div>
                <div className="P3">
                    {players[2]}
                    <Image src={AvatarPlaceholder} width={100} height={100} />
                </div>
                <div className="P4">
                    {players[3]}
                    <Image src={AvatarPlaceholder} width={100} height={100} />
                </div>
                <div className="P5">
                    {players[4]}
                    <Image src={AvatarPlaceholder} width={100} height={100} />
                </div>
                <div className="P6">
                    {players[5]}
                    <Image src={AvatarPlaceholder} width={100} height={100} />
                </div>
                <div className="P7">
                    {players[6]}
                    <Image src={AvatarPlaceholder} width={100} height={100} />
                </div>
                <div className="P8">
                    {players[7]}
                    <Image src={AvatarPlaceholder} width={100} height={100} />
                </div>
                <div className="Bomb">
                    <Image src={BombPlaceholder} width={100} height={100} />
                </div>
                <div className="Timer" id="Timer"></div>
                <div className="A0" id="A0">
                    <Image
                        src={RightArrowPlaceholder}
                        width={100}
                        height={100}
                    />
                </div>
                <div className="A1" id="A1">
                    <Image
                        src={RightArrowPlaceholder}
                        width={100}
                        height={100}
                    />
                </div>
                <div className="A2" id="A2">
                    <Image
                        src={RightArrowPlaceholder}
                        width={100}
                        height={100}
                    />
                </div>
                <div className="A3" id="A3">
                    <Image
                        src={RightArrowPlaceholder}
                        width={100}
                        height={100}
                    />
                </div>
                <div className="A4" id="A4">
                    <Image
                        src={RightArrowPlaceholder}
                        width={100}
                        height={100}
                    />
                </div>
                <div className="A5" id="A5">
                    <Image
                        src={RightArrowPlaceholder}
                        width={100}
                        height={100}
                    />
                </div>
                <div className="A6" id="A6">
                    <Image
                        src={RightArrowPlaceholder}
                        width={100}
                        height={100}
                    />
                </div>
                <div className="A7" id="A7">
                    <Image
                        src={RightArrowPlaceholder}
                        width={100}
                        height={100}
                    />
                </div>
                <div className="Cycle">
                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                        onClick={sendNextTurnRequest}
                    >
                        {' '}
                        Simulate Next Turn (dev)
                    </Button>
                </div>
            </div>
        </>
    );
}; */

export {};
