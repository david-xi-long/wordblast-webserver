import Packet from '../Packet';

export default class PacketInGameEnd extends Packet {
    public static of = (obj) => new PacketInGameEnd();
}
