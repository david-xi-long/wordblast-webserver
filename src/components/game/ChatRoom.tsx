import {useState, useEffect, KeyboardEvent } from 'react';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInPlayerMessage from '../../scripts/packets/PacketInPlayerMessage';

export default function ChatRoom(props: {gameSocket: GameSocket; username: string; gameId: string}) {
    const [formValue, setFormValue] = useState('');
    const [messages, setMessages] = useState([]);


    // handle receiving messages
    const receiveMessages = () => {
        props.gameSocket.subscribe<PacketInPlayerMessage>('player-message', (packet: { getMessage: () => any; }) => {
            console.log(packet.getMessage());
        });
    };

    // handle sending messages
    const sendMessage = async(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            if (formValue === '') {
                return;
            }
            console.log(props.username, "trying to send message:", formValue);
            props.gameSocket.fireAndForget('player-message', new PacketInPlayerMessage(props.gameId, props.username, formValue));
        }
    }

    // Run only once after the component has mounted.
    useEffect(() => {
        receiveMessages();
    }, []);


    return (
        <div className="chatbox">
            <input className="chat-input" onKeyDown={(e) => sendMessage(e)} value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        </div>
    )
}


