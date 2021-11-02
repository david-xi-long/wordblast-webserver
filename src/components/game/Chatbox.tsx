import {
    createContext,
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Input, Button } from '@vechaiui/react';
import { useForm } from 'react-hook-form';
import Card from '../vechai-extensions/Card';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInPlayerMessage from '../../scripts/packets/PacketInPlayerMessage';
import PacketOutPlayerMessage from '../../scripts/packets/PacketOutPlayerMessage';

interface ChatboxMessage {
    uid: number;
    username: string;
    text: string;
}

type MessageHandler = (message: ChatboxMessage) => void;

const ChatboxContext = createContext({
    addMessage: (() => {}) as MessageHandler,
    setSendMessage: (() => {}) as Dispatch<SetStateAction<MessageHandler>>,
});

interface ChatboxImpls {
    Game: FunctionComponent<{ gameId: string; gameSocket: GameSocket }>;
}

const Chatbox: FunctionComponent<{ username: string }> & ChatboxImpls = ({
    username,
    children,
}) => {
    const [messages, setMessages] = useState([] as ChatboxMessage[]);
    const [sendMessage, setSendMessage] = useState(() => (message) => {});

    const { register, handleSubmit, setValue } = useForm();

    const addMessage = (message: ChatboxMessage) =>
        setMessages((curMessages) => [...curMessages, message]);

    const submitFormHandler = ({ text }: { text: string }) => {
        setValue('text', '');
        sendMessage({
            uid: Math.random(),
            username,
            text,
        });
    };

    return (
        <ChatboxContext.Provider value={{ addMessage, setSendMessage }}>
            <div className="chatbox">
                <div className="messages-container">
                    {/* Need this div to show the messages in the correct order */}
                    <div>
                        {messages.map((message) => (
                            <div
                                key={message.uid}
                                className="message-container"
                            >
                                <Card className="message-card">
                                    <p className="message-username">
                                        {message.username}
                                    </p>
                                    <p className="message-text">
                                        {message.text}
                                    </p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
                <form onSubmit={handleSubmit(submitFormHandler)}>
                    <Input.Group size="lg">
                        <Input
                            placeholder="Type your message here."
                            variant="solid"
                            autoComplete="off"
                            className="chat-input"
                            {...register('text')}
                        />
                        <Input.RightElement>
                            <Button
                                type="submit"
                                size="sm"
                                variant="solid"
                                color="primary"
                                className="send-button"
                            >
                                Send
                            </Button>
                        </Input.RightElement>
                    </Input.Group>
                </form>
            </div>
            {children}
        </ChatboxContext.Provider>
    );
};

const Game: ChatboxImpls['Game'] = ({ gameId, gameSocket }) => {
    const { addMessage, setSendMessage } = useContext(ChatboxContext);

    // Run only once after the component has mounted.
    useEffect(() => {
        gameSocket.subscribe<PacketInPlayerMessage>(
            'chat-message',
            (packet) => {
                addMessage({
                    uid: Math.random(),
                    username: packet.getUsername(),
                    text: packet.getMessage(),
                });
            }
        );

        setSendMessage(() => (message: ChatboxMessage) => {
            if (message.text === '') {
                return;
            }
            gameSocket.fireAndForget(
                'chat-message',
                new PacketOutPlayerMessage(
                    gameId,
                    message.username,
                    message.text
                )
            );
        });
    }, []);

    return null;
};

Chatbox.Game = Game;

export default Chatbox;
