import { Alert } from '@vechaiui/alert';
import { Button } from '@vechaiui/button';
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    RequiredIndicator,
} from '@vechaiui/forms';
import router, { useRouter } from 'next/router';
import { FunctionComponent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInCheckWord from '../../scripts/packets/PacketInCheckWord';
import PacketOutCheckWord from '../../scripts/packets/PacketOutCheckWord';
import Image from 'next/image'
import AvatarPlaceholder from '../../../public/AvatarPlaceholder.png';
import BombPlaceholder from '../../../public/Bomb.png';
import RightArrowPlaceholder from '../../../public/arrows/RightArrowPlaceholder.png';
import next from 'next';
import PacketOutNextTurn from '../../scripts/packets/PacketOutNextTurn';
import PacketInNextTurn from '../../scripts/packets/PacketInNextTurn';
//import Timer from './Timer';

const MultiplayerGameplayPage: FunctionComponent<{
    players: string[];
    gameSocket: GameSocket;
    username: string }> = ({
    players, gameSocket, username
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [wordIsValid, setWordIsValid] = useState(true);
    const [correctInput, setCorrectInput] = useState(true);
    const [outOfTime, setOutOfTime] = useState(true);
    const [goNextTurn, setGoNextTurn] = useState(false);
    const router = useRouter();
    const {gameId} = router.query as {gameId: string};
    var playerLoc = players.indexOf(username);
    var currentPlayer = 0;
    var timeToAnswer = 1;

    const {
        register, 
        handleSubmit,
        formState: { errors },
    } = useForm();
    

    const submit = async ({inputWord}: {inputWord: string}) => {
        setIsLoading(true);
        gameSocket
            .requestResponse<PacketInCheckWord>(
                'check-word',
                new PacketOutCheckWord(inputWord, gameId)
            )
            .then(
                (packet) => {
                    if (packet.wordIsValid()==true) {
                        // Implement word being correct
                        console.log("Word is valid");
                        setCorrectInput(true);
                        router.replace("/sucess");
                    } else {
                        // Implement word being incorrect
                        setWordIsValid(false);
                        //router.replace("/failure");
                        router.reload();
                    }
                },
                () => {
                    // Something has gone wrong where packet was not received
                    router.replace("/");
                }
            );
    };

    const nextTurn = () => {
        gameSocket.subscribe<PacketInNextTurn>('next-turn', (packet: {getLetterCombo: () => any; }) => {
            setGoNextTurn(true);
            var letterCombo = packet.getLetterCombo();
            var element = document.getElementById("A" + currentPlayer);
            if (element != null) {
                element.style.visibility = "hidden";
            }
            currentPlayer = currentPlayer + 1;
            if (currentPlayer == players.length) {
                currentPlayer = 0;
            }
            element = document.getElementById("A" + currentPlayer);
            if (element != null) {
                element.style.visibility = "visible";
            }
            var timeleft = timeToAnswer;
            var testTimer = setInterval(function() {
            var element = document.getElementById("Timer");
            if (element != null) {
                if (timeleft <= 0) {
                    clearInterval(testTimer);
                    element.innerHTML = "Finished";
                    if (playerLoc == currentPlayer) {
                        gameSocket.fireAndForget("next-turn", new PacketOutNextTurn(gameId, outOfTime));
                    }
                } else {
                    element.innerHTML = timeleft + " seconds remaining";
                }
                timeleft -= 1;
            }
        }, 1000);
        });
    }

    const sendNextTurnRequest = async () => {
        gameSocket.fireAndForget("next-turn", new PacketOutNextTurn(gameId, outOfTime));
    }


    useEffect(() => {
        nextTurn();
    }, []);

    return (
        <>
        <div>
             <Button 
        border="none"
        color="pink"
        height = "200px"
        onClick={() => console.log("Start Game!")}
        radius = "50%"
        width = "200px"
        children = "I'm a pink circle!"
      />
        <form onSubmit={handleSubmit(submit)}>
            {!wordIsValid && (
                <Alert variant="subtle"> That word is invalid.</Alert>
            )}
            <FormControl id="inputWord" invalid={errors.input !== undefined}>
                <FormLabel>
                    Input
                </FormLabel>
                <Input
                    type="inputWord"
                    {...register('inputWord', { required: true })}
                />  
                {errors.inputWord?.type == 'required' && (<FormErrorMessage>Input must not be blank.</FormErrorMessage>)}
                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                    >
                        Submit Input
                    </Button>
            </FormControl>
        </form>
        </div>
        <div className="player_container">
                <div className="P1">{players[0]}<Image src={AvatarPlaceholder} width={100} height={100}/></div>
                <div className="P2">{players[1]}<Image src={AvatarPlaceholder} width={100} height={100}/></div>
                <div className="P3">{players[2]}<Image src={AvatarPlaceholder} width={100} height={100}/></div>
                <div className="P4">{players[3]}<Image src={AvatarPlaceholder} width={100} height={100}/></div>
                <div className="P5">{players[4]}<Image src={AvatarPlaceholder} width={100} height={100}/></div>
                <div className="P6">{players[5]}<Image src={AvatarPlaceholder} width={100} height={100}/></div>    
                <div className="P7">{players[6]}<Image src={AvatarPlaceholder} width={100} height={100}/></div>
                <div className="P8">{players[7]}<Image src={AvatarPlaceholder} width={100} height={100}/></div>
                <div className="Bomb"><Image src={BombPlaceholder} width={100} height={100}/></div>
                <div className="Timer" id="Timer"></div>
                <div className="A0" id="A0"><Image src={RightArrowPlaceholder} width={100} height={100}/></div>
                <div className="A1" id="A1"><Image src={RightArrowPlaceholder} width={100} height={100}/></div>
                <div className="A2" id="A2"><Image src={RightArrowPlaceholder} width={100} height={100}/></div>
                <div className="A3" id="A3"><Image src={RightArrowPlaceholder} width={100} height={100}/></div>
                <div className="A4" id="A4"><Image src={RightArrowPlaceholder} width={100} height={100}/></div>
                <div className="A5" id="A5"><Image src={RightArrowPlaceholder} width={100} height={100}/></div>    
                <div className="A6" id="A6"><Image src={RightArrowPlaceholder} width={100} height={100}/></div>
                <div className="A7" id="A7"><Image src={RightArrowPlaceholder} width={100} height={100}/></div>
                <div className="Cycle"><Button type="submit" variant="solid" color="primary" onClick={sendNextTurnRequest}> Simulate Next Turn (dev)</Button></div>
        </div>
        </>
    );
};

export default MultiplayerGameplayPage;
