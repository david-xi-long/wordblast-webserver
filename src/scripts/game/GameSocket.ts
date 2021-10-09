import {
    IdentitySerializer,
    JsonSerializer,
    RSocketClient,
} from 'rsocket-core';
import RSocketWebsocketClient from 'rsocket-websocket-client';
import { ReactiveSocket, Payload } from 'rsocket-types';
import { Flowable, Single } from 'rsocket-flowable';
import Packet from '../packets/Packet';
import SocketUtils from './SocketUtils';

export default class GameSocket {
    private static readonly GAME_SOCKET_URL = 'ws://localhost:7000';

    private socket: ReactiveSocket<unknown, unknown> | undefined = undefined;

    public connect = async () => {
        if (this.socket !== undefined) return;

        const client = new RSocketClient({
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer,
            },
            setup: {
                keepAlive: 60000,
                lifetime: 180000,
                dataMimeType: 'application/json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
            },
            transport: new RSocketWebsocketClient({
                url: GameSocket.GAME_SOCKET_URL,
            }),
        });

        this.socket = await client.connect();
    };

    public disconnect = async () => {
        if (this.socket === undefined) return;

        this.socket.close();
    };

    private proxy = <T>(
        destination: string,
        packet: Packet,
        fn: ((payload: Payload<unknown, unknown>) => T) | undefined
    ) => {
        if (fn === undefined)
            throw new Error('Passed socket function is undefined.');

        const code = String.fromCharCode(destination.length);

        return fn.call(this.socket, {
            data: packet,
            metadata: `${code}${destination}`,
        });
    };

    public fireAndForget = (destination: string, packet: Packet) =>
        this.proxy(destination, packet, this.socket?.fireAndForget);

    public requestResponse = <T>(destination: string, packet: Packet) =>
        this.proxy<Single<Payload<unknown, unknown>>>(
            destination,
            packet,
            this.socket?.requestResponse
        ).map(({ data }) => SocketUtils.resolvePacket(data) as T);

    public requestStream = <T>(destination: string, packet: Packet) =>
        this.proxy<Flowable<Payload<unknown, unknown>>>(
            destination,
            packet,
            this.socket?.requestStream
        ).map(({ data }) => SocketUtils.resolvePacket(data) as T);
}
