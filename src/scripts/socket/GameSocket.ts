import {
    IdentitySerializer,
    JsonSerializer,
    RSocketClient,
} from 'rsocket-core';
import RSocketWebsocketClient from 'rsocket-websocket-client';
import { ReactiveSocket, Payload } from 'rsocket-types';
import { Single } from 'rsocket-flowable';
import Packet from '../packets/Packet';
import SocketUtils from './SocketUtils';
import ResponderImpl from './ResponderImpl';

export default class GameSocket {
    private static readonly GAME_SOCKET_URL = 'ws://localhost:7000';

    private readonly responder = new ResponderImpl();

    private socket: ReactiveSocket<unknown, unknown> | undefined = undefined;

    public connect = async () => {
        if (this.socket !== undefined) return;

        const client = new RSocketClient({
            setup: {
                keepAlive: 60000,
                lifetime: 180000,
                dataMimeType: 'application/json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
            },
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer,
            },
            responder: this.responder,
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

    private proxyResponse = <T>(
        destination: string,
        packet: Packet,
        fn: ((payload: Payload<unknown, unknown>) => Single<any>) | undefined
    ) =>
        new Promise<T>((res, rej) => {
            this.proxy(destination, packet, fn).subscribe({
                onComplete: ({ data }) => {
                    try {
                        res(SocketUtils.resolvePacket(data) as T);
                    } catch (err) {
                        rej(err);
                    }
                },
                onError: (err: any) => rej(err),
            });
        });

    public fireAndForget = (destination: string, packet: Packet) =>
        this.proxy(destination, packet, this.socket?.fireAndForget);

    public requestResponse = <T extends Packet>(
        destination: string,
        packet: Packet
    ) =>
        this.proxyResponse<T>(
            destination,
            packet,
            this.socket?.requestResponse
        );

    // INFO: This requires a different implementation.
    // public requestStream = <T extends Packet>(
    //     destination: string,
    //     packet: Packet
    // ) =>
    //     this.proxy<Flowable<Payload<unknown, unknown>>>(
    //         destination,
    //         packet,
    //         this.socket?.requestStream
    //     ).map(({ data }) => SocketUtils.resolvePacket(data) as T);

    public subscribe = <T extends Packet>(
        destination: string,
        subscriber: (packet: T) => any
    ) => {
        this.responder.addSubscriber(
            destination,
            // NOTE: Casting here could bring up issues in the future.
            subscriber as (packet: Packet) => any
        );
    };
}
