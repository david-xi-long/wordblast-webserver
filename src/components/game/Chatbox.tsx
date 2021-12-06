import {
    createContext,
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Button, Card, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import GameSocket from '../../scripts/socket/GameSocket';
import PacketInPlayerMessage from '../../scripts/packets/in/PacketInPlayerMessage';
import PacketOutPlayerMessage from '../../scripts/packets/out/PacketOutPlayerMessage';

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
    Game: FunctionComponent<{ gameUid: string; gameSocket: GameSocket }>;
}

const Chatbox: FunctionComponent<{ username: string }> & ChatboxImpls = ({
    username,
    children,
}) => {
    const [messages, setMessages] = useState([] as ChatboxMessage[]);
    const [sendMessage, setSendMessage] = useState(() => (message) => {});

    const form = useForm({
        initialValues: {
            text: '',
        },

        validationRules: {
            text: (value) => value.length > 0,
        },
    });

    const addMessage = (message: ChatboxMessage) =>
        setMessages((curMessages) => [...curMessages, message]);

    const submitFormHandler = ({ text }: { text: string }) => {
        form.setFieldValue('text', '');

        sendMessage({
            uid: Math.random(),
            username,
            text,
        });
    };

    return (
        <ChatboxContext.Provider value={{ addMessage, setSendMessage }}>
            <div className="h-screen chatbox">
                <div className="messages-container">
                    {/* Need this div to show the messages in the correct order */}
                    <div>
                        {messages.map((message) => (
                            <Card key={message.uid} className="mt-2.5">
                                <p className="font-semibold text-sm text-blue-200">
                                    {message.username}
                                </p>
                                <p className="text-sm">{message.text}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                <form onSubmit={form.onSubmit(submitFormHandler)}>
                    <TextInput
                        placeholder="Type your message here."
                        autoComplete="off"
                        value={form.values.text}
                        onChange={(event) =>
                            form.setFieldValue(
                                'text',
                                event.currentTarget.value
                            )
                        }
                        rightSection={
                            <Button type="submit" size="xs" compact>
                                Send
                            </Button>
                        }
                        rightSectionWidth={56}
                    />
                </form>
            </div>
            {children}
        </ChatboxContext.Provider>
    );
};

const Game: ChatboxImpls['Game'] = ({ gameUid, gameSocket }) => {
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
                    gameUid,
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
