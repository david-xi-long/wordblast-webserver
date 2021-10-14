import { IconButton } from '@vechaiui/button';
import { Input } from '@vechaiui/forms';
import { Icon } from '@vechaiui/icon';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import GameSocket from '../../scripts/game/GameSocket';
import PacketOutUsernameChange from '../../scripts/packets/PacketOutUsernameChange';
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
            .requestResponse(
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
                    // Should probably inform user in a better manner.
                }
            );
    };

    return (
        <div
            className={`${
                editingUsername ? 'mb-2' : 'mb-4'
            } flex flex-col items-center`}
        >
            <h2 className="font-semibold text-lg mb-1">Your username:</h2>
            <div className={editingUsername ? 'w-0 min-w-full' : ''}>
                {editingUsername && (
                    <Input
                        size="md"
                        defaultValue={username}
                        className="mt-1"
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                setEditingUsername(false);
                            } else if (e.key === 'Enter') {
                                submitUsername(e.currentTarget.value);
                            }
                        }}
                    />
                )}
                {!editingUsername && (
                    <div className="flex items-center">
                        <p>{username}</p>
                        <IconButton
                            variant="ghost"
                            size="xs"
                            className="ml-1.5"
                            onClick={() => setEditingUsername(true)}
                        >
                            <Icon
                                as={Edit}
                                label="Edit username"
                                className="h-4 w-4"
                            />
                        </IconButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LobbyUsernameField;
