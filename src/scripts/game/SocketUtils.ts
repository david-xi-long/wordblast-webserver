import Packet from '../packets/Packet';
import PacketInGameInfo from '../packets/PacketInGameInfo';
import PacketInSelectUsername from '../packets/PacketInSelectUsername';

export default class SocketUtils {
    public static resolvePacket = (data: any) => {
        let packet: Packet;

        switch (data.type) {
            case 'PACKET_OUT_GAME_INFO':
                packet = PacketInGameInfo.of(data);
                break;
            case 'PACKET_OUT_SELECT_USERNAME':
                packet = PacketInSelectUsername.of(data);
                break;
            case 'PACKET_OUT_EXCEPTION':
                throw new Error(`Received exception packet: ${data.message}`);
            default:
                throw new Error(`Unexpected packet: ${data.type}`);
        }

        return packet;
    };
}
