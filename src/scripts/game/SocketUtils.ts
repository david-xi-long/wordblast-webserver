import Packet from '../packets/Packet';
import PacketInGameInfo from '../packets/PacketInGameInfo';

export default class SocketUtils {
    public static resolvePacket = (data: any) => {
        let packet: Packet;

        switch (data.type) {
            case 'PACKET_OUT_GAME_INFO':
                packet = PacketInGameInfo.of(data);
                break;
            default:
                throw new Error(`Unexpected packet: ${data.type}`);
        }

        return packet;
    };
}
