import { useRouter } from 'next/router';
import { FunctionComponent, Dispatch, SetStateAction, useState } from 'react';
import { useForm } from '@mantine/hooks';
import { Alert, Button, TextInput } from '@mantine/core';
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

    const form = useForm({
        initialValues: {
            username: `Guest-${uid()}`,
        },
        validationRules: {
            username: (value) => value.length > 0,
        },
    });

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
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
            <form onSubmit={form.onSubmit(submit)}>
                <h2 className="font-semibold text-xl">
                    Enter your username below
                </h2>

                <div className="mt-2.5 w-0 min-w-full flex items-start">
                    <TextInput
                        error={
                            form.errors.username && 'Please specify a username.'
                        }
                        value={form.values.username}
                        onChange={(event) =>
                            form.setFieldValue(
                                'username',
                                event.currentTarget.value
                            )
                        }
                    />

                    <Button
                        type="submit"
                        variant="filled"
                        size="xs"
                        loading={isLoading}
                        className="ml-2 mt-0.5"
                    >
                        Next
                    </Button>
                </div>

                {usernameExists && (
                    <Alert
                        className="mt-3"
                        color="red"
                        title="Something went wrong"
                    >
                        That username is taken.
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default UsernameSelectPage;
