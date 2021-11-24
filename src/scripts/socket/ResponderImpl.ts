import { Single, Flowable } from 'rsocket-flowable';
import { Payload, Responder } from 'rsocket-types';
import Packet from '../packets/Packet';
import SocketUtils from './SocketUtils';

export default class ResponderImpl implements Responder<string, string> {
    public subscribers: Map<string, Set<(packet: Packet) => any>> = new Map();

    public addSubscriber = (
        destination: string,
        subscriber: (packet: Packet) => any
    ) => {
        const code = String.fromCharCode(destination.length);
        const encodedDestination = `${code}${destination}`;

        let destSubs = this.subscribers.get(encodedDestination);

        if (destSubs === undefined) {
            destSubs = new Set();
            this.subscribers.set(encodedDestination, destSubs);
        }

        destSubs.add(subscriber);
    };

    public removeSubsciber = (
        destination: string,
        subsciber: (packet: Packet) => any
    ) => {
        this.subscribers.get(destination)?.delete(subsciber);
    };

    public fireAndForget = (payload: Payload<string, string>) => {
        if (payload.metadata === undefined) return;

        const packet = SocketUtils.resolvePacket(payload.data);

        this.subscribers.get(payload.metadata)?.forEach((sub) => sub(packet));
    };

    // TODO: Implement subscribers for this type of request.
    public requestResponse = (payload: Payload<string, string>) =>
        Single.of(payload);

    // TODO: Implement subscribers for this type of request.
    public requestStream = (payload: Payload<string, string>) =>
        Flowable.just(payload);

    // TODO: Implement subscribers for this type of request.
    public requestChannel = (payloads: Flowable<Payload<string, string>>) =>
        Flowable.just(payloads[0]);

    // TODO: Implement subscribers for this type of request.
    public metadataPush = (payload: Payload<string, string>) => Single.never();
}
