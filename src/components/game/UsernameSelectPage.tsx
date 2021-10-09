import { Alert } from '@vechaiui/alert';
import { Button } from '@vechaiui/button';
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    RequiredIndicator,
} from '@vechaiui/forms';
import { useRouter } from 'next/router';
import { FunctionComponent, Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import GameSocket from '../../scripts/game/GameSocket';
import { uid } from '../../scripts/miscellaneous/math';
import PacketInSelectUsername from '../../scripts/packets/PacketInSelectUsername';
import PacketOutSelectUsername from '../../scripts/packets/PacketOutSelectUsername';

const UsernameSelectPage: FunctionComponent<{
    setUsername: Dispatch<SetStateAction<string>>;
    gameSocket: GameSocket;
}> = ({ setUsername, gameSocket }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);
    const router = useRouter();

    const { gameId } = router.query as { gameId: string };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: { username: `Guest-${uid()}` } });

    const submit = async ({ username }: { username: string }) => {
        setIsLoading(true);

        gameSocket
            .requestResponse<PacketInSelectUsername>(
                'select-username',
                new PacketOutSelectUsername(gameId, username)
            )
            .then(
                (packet) => {
                    if (packet.usernameExists()) {
                        setUsernameExists(true);
                    } else {
                        setUsernameExists(false);
                        setUsername(username);
                    }

                    setIsLoading(false);
                },
                () => {
                    // An exception occured while sending data to the game socket.
                    // Redirect to the main page, as the game is probably broken.
                    router.replace('/');
                }
            );
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            {usernameExists && (
                <Alert variant="subtle">That username is taken.</Alert>
            )}

            <FormControl id="username" invalid={errors.username !== undefined}>
                <FormLabel>
                    Username
                    <RequiredIndicator />
                </FormLabel>
                <Input
                    type="username"
                    {...register('username', { required: true })}
                />
                {errors.username?.type === 'required' && (
                    <FormErrorMessage>Username is required.</FormErrorMessage>
                )}
            </FormControl>

            <Button
                type="submit"
                variant="solid"
                color="primary"
                loading={isLoading}
            >
                Next
            </Button>
        </form>
    );
};

export default UsernameSelectPage;
