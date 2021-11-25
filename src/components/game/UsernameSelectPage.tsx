import { Alert } from '@vechaiui/alert';
import { Button } from '@vechaiui/button';
import { FormControl, FormErrorMessage, Input } from '@vechaiui/forms';
import { useRouter } from 'next/router';
import { FunctionComponent, Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import GameSocket from '../../scripts/socket/GameSocket';
import { uid } from '../../scripts/utils/math';
import PacketInUsernameSelect from '../../scripts/packets/in/PacketInUsernameSelect';
import PacketOutUsernameSelect from '../../scripts/packets/out/PacketOutUsernameSelect';

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
            .requestResponse<PacketInUsernameSelect>(
                'select-username',
                new PacketOutUsernameSelect(gameId, username)
            )
            .then(
                (packet) => {
                    if (packet.getUsernameExists()) {
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
        <div className="h-screen w-full flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit(submit)}>
                <h2 className="font-semibold text-xl">
                    Enter your username below
                </h2>

                <div className="mt-2 w-0 min-w-full flex items-center">
                    <FormControl
                        id="username"
                        invalid={errors.username !== undefined}
                    >
                        <Input
                            type="username"
                            autoComplete="off"
                            size="lg"
                            {...register('username', { required: true })}
                        />
                        {errors.username?.type === 'required' && (
                            <FormErrorMessage>
                                Username is required.
                            </FormErrorMessage>
                        )}
                    </FormControl>

                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                        loading={isLoading}
                        className="ml-2"
                    >
                        Next
                    </Button>
                </div>

                {usernameExists && (
                    <Alert variant="subtle" className="mt-3">
                        That username is taken.
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default UsernameSelectPage;
