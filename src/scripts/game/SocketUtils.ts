import Packet from '../packets/Packet';
import PacketInGameInfo from '../packets/PacketInGameInfo';
import PacketInPlayerState from '../packets/PacketInPlayerState';
import PacketInCheckWord from '../packets/PacketInCheckWord';
import PacketInPlayerMessage from '../packets/PacketInPlayerMessage';
import PacketInUsernameChange from '../packets/PacketInUsernameChange';
import PacketInUsernameSelect from '../packets/PacketInUsernameSelect';
import PacketInStartGame from '../packets/PacketInStartGame';
import PacketInNextTurn from '../packets/PacketInNextTurn';
import PacketInPlayerReadyState from '../packets/PacketInPlayerReadyState';
import PacketInRoundInfo from '../packets/PacketInRoundInfo';
import PacketInSettingChange from '../packets/PacketInSettingChange';

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
            case 'PACKET_OUT_USERNAME_SELECT':
                packet = PacketInUsernameSelect.of(data);
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
            case 'PACKET_OUT_START_GAME':
                packet = PacketInStartGame.of(data);
                break;
            case 'PACKET_OUT_NEXT_TURN':
                packet = PacketInNextTurn.of(data);
                break;
            case 'PACKET_OUT_PLAYER_READY_STATE':
                packet = PacketInPlayerReadyState.of(data);
                break;
            case 'PACKET_OUT_ROUND_INFO':
                packet = PacketInRoundInfo.of(data);
                break;
            case 'PACKET_OUT_SETTING_CHANGE':
                packet = PacketInSettingChange.of(data);
                break;
            case 'PACKET_OUT_EXCEPTION':
                throw new Error(`Received exception packet: ${data.message}`);
            default:
                throw new Error(`Unexpected packet: ${data.type}`);
        }

        return packet;
    };
}
