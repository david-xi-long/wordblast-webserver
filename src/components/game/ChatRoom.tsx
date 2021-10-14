import { useState, useEffect, KeyboardEvent } from 'react';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInPlayerMessage from '../../scripts/packets/PacketInPlayerMessage';
import PacketOutPlayerMessage from '../../scripts/packets/PacketOutPlayerMessage';

export default function ChatRoom(props: {
    gameSocket: GameSocket;
    username: string;
    gameId: string;
}) {
    const [formValue, setFormValue] = useState('');
    const [messages, setMessages] = useState([] as string[]);

    // handle receiving messages
    const receiveMessages = () => {
        props.gameSocket.subscribe<PacketInPlayerMessage>(
            'chat-message',
            (packet: { getMessage: () => any; getUsername: () => any }) => {
                console.log(packet.getMessage(), packet.getUsername());
                setMessages((oldMessages) => [
                    ...oldMessages,
                    packet.getMessage(),
                ]);
            }
        );
    };

    // handle sending messages
    const sendMessage = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            if (formValue === '') {
                return;
            }
            props.gameSocket.fireAndForget(
                'chat-message',
                new PacketOutPlayerMessage(
                    props.gameId,
                    props.username,
                    formValue
                )
            );
            setFormValue('');
        }
    };

    // Run only once after the component has mounted.
    useEffect(() => {
        receiveMessages();
    }, []);

    return (
        <div className="chatbox">
            <input
                className="chat-input"
                onKeyDown={(e) => sendMessage(e)}
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
            />
            {messages.map((message) => (
                <div key={message}>{message}</div>
            ))}
        </div>
    );
}
