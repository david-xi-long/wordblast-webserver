import Packet from '../packets/Packet';
import PacketInGameInfo from '../packets/PacketInGameInfo';
import PacketInPlayerState from '../packets/PacketInPlayerState';
import PacketInSelectUsername from '../packets/PacketInSelectUsername';
import PacketInCheckWord from '../packets/PacketInCheckWord';
import PacketInPlayerMessage from '../packets/PacketInPlayerMessage';
import PacketInUsernameChange from '../packets/PacketInUsernameChange';

export default class SocketUtils {
    public static resolvePacket = (data: any) => {
        let packet: Packet;

        switch (data.type) {
            case 'PACKET_OUT_PLAYER_MESSAGE':
                packet = PacketInPlayerMessage.of(data);
                break;
            case 'PACKET_OUT_GAME_INFO':
                packet = PacketInGameInfo.of(data);
                break;
            case 'PACKET_OUT_SELECT_USERNAME':
                packet = PacketInSelectUsername.of(data);
                break;
            case 'PACKET_OUT_PLAYER_STATE':
                packet = PacketInPlayerState.of(data);
                break;
            case 'PACKET_OUT_CHECK_WORD':
                packet = PacketInCheckWord.of(data);
                break;
            case 'PACKET_OUT_USERNAME_CHANGE':
                packet = PacketInUsernameChange.of(data);
                break;
            case 'PACKET_OUT_EXCEPTION':
                throw new Error(`Received exception packet: ${data.message}`);
            default:
                throw new Error(`Unexpected packet: ${data.type}`);
        }

        return packet;
    };
}
