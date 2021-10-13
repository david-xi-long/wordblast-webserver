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



const gameplayPage: FunctionComponent = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [wordIsValid, setWordIsValid] = useState(true);
    const [correctInput, setCorrectInput] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const router = useRouter();
    const [gameSocket] = useState(new GameSocket());
    const {gameId} = router.query as {gameId: string};

    useEffect(() => {
        (async () => {
            await gameSocket.connect();
            setIsConnected(true);
        })();

        return () => {
            gameSocket.disconnect();
        };
    }, []);

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
                    } else {
                    }
                },
                () => {
                    // Something has gone wrong
                }
            );
    };

    return (
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
    );
};

export default gameplayPage;
