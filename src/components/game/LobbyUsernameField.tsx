import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { ActionIcon, TextInput } from '@mantine/core';
import GameSocket from '../../scripts/socket/GameSocket';
import PacketInUsernameChange from '../../scripts/packets/in/PacketInUsernameChange';
import PacketOutUsernameChange from '../../scripts/packets/out/PacketOutUsernameChange';
import Edit from '../icons/Edit';

const LobbyUsernameField: FunctionComponent<{
    gameId: string;
    gameSocket: GameSocket;
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
}> = ({ gameId, gameSocket, username, setUsername }) => {
    const [editingUsername, setEditingUsername] = useState(false);

    const submitUsername = (newUsername: string) => {
        // If submitting the user's current username, do nothing.
        if (username === newUsername) {
            setEditingUsername(false);
            return;
        }

        gameSocket
            .requestResponse<PacketInUsernameChange>(
                'change-username',
                new PacketOutUsernameChange(gameId, username, newUsername)
            )
            .then(
                () => {
                    setEditingUsername(false);
                    setUsername(newUsername);
                },
                () => {
                    // Could not change the username, do nothing.
                    // TODO: Notification indicated error.
                }
            );
    };

    return (
        <div
            className={`mt-8 ${
                editingUsername ? 'mb-2' : 'mb-4'
            } flex flex-col items-center`}
        >
            <h2 className="font-semibold text-lg mb-1">Your username:</h2>

            <div className={editingUsername ? 'w-0 min-w-full' : ''}>
                {editingUsername && (
                    <TextInput
                        defaultValue={username}
                        className="mt-1"
                        onKeyDown={(e) => {
                            if (e.key !== 'Enter') return;
                            submitUsername(e.currentTarget.value);
                        }}
                        onBlur={() => {
                            setEditingUsername(false);
                        }}
                    />
                )}

                {!editingUsername && (
                    <div className="flex items-center">
                        <p>{username}</p>
                        <ActionIcon
                            variant="transparent"
                            className="ml-1.5"
                            onClick={() => setEditingUsername(true)}
                        >
                            <Edit className="h-4 w-4" />
                        </ActionIcon>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LobbyUsernameField;
