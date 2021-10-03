import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Packet from '../packets/Packet';
import PacketOutGameJoin from '../packets/PacketOutGameJoin';
import SocketUtils from './SocketUtils';

export default class GameSocket {
    private static readonly GAME_SOCKET_URL = 'http://localhost:8080/socket';

    private client: Stomp.Client | undefined = undefined;

    public connect = () => {
        this.client = Stomp.over(new SockJS(GameSocket.GAME_SOCKET_URL));

        const { client } = this;

        client.connect({}, () => {
            const joinPacket = new PacketOutGameJoin(
                '7d1bffde-41ca-451a-8649-205eb07efaab',
                '7d1bffde-41ca-451a-8649-205eb07efaab'
            );

            this.subscribe('/game/info', (packet) => {
                console.log(packet);
            });

            this.send('/game/join', joinPacket);
        });
    };

    public send = (destination: string, packet: Packet) => {
        if (this.client === undefined) return;

        this.client.send(destination, {}, JSON.stringify(packet));
    };

    public subscribe = (
        desination: string,
        listener: (packet: Packet) => any
    ) => {
        if (this.client === undefined) return;

        this.client.subscribe(desination, (message) => {
            const data = JSON.parse(message.body);
            const packet = SocketUtils.resolvePacket(data);
            listener(packet);
        });
    };
}
