import Packet from '../packets/Packet';
import PacketInGameInfo from '../packets/in/PacketInGameInfo';
import PacketInCheckWord from '../packets/in/PacketInCheckWord';
import PacketInPlayerMessage from '../packets/in/PacketInPlayerMessage';
import PacketInUsernameChange from '../packets/in/PacketInUsernameChange';
import PacketInUsernameSelect from '../packets/in/PacketInUsernameSelect';
import PacketInStartGame from '../packets/in/PacketInStartGame';
// import PacketInNextTurn from '../packets/in/PacketInNextTurn';
import PacketInPlayerReadyState from '../packets/in/PacketInPlayerReadyState';
import PacketInRoundInfo from '../packets/in/PacketInRoundInfo';
import PacketInSettingChange from '../packets/in/PacketInSettingChange';
import PacketInPlayerEliminated from '../packets/in/PacketInPlayerEliminated';
import PacketInDefinition from '../packets/in/PacketInDefinition';
import PacketInLivesChange from '../packets/in/PacketInLivesChange';
import PacketInPlayerJoin from '../packets/in/PacketInPlayerJoin';
import PacketInPlayerQuit from '../packets/in/PacketInPlayerQuit';
import PacketInGameEnd from '../packets/in/PacketInGameEnd';

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
            case 'PACKET_OUT_CHECK_WORD':
                packet = PacketInCheckWord.of(data);
                break;
            case 'PACKET_OUT_USERNAME_CHANGE':
                packet = PacketInUsernameChange.of(data);
                break;
            case 'PACKET_OUT_START_GAME':
                packet = PacketInStartGame.of(data);
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
            case 'PACKET_OUT_PLAYER_ELIMINATED':
                packet = PacketInPlayerEliminated.of(data);
                break;
            case 'PACKET_OUT_DEFINITION':
                packet = PacketInDefinition.of(data);
                break;
            case 'PACKET_OUT_LIVES_CHANGE':
                packet = PacketInLivesChange.of(data);
                break;
            case 'PACKET_OUT_PLAYER_JOIN':
                packet = PacketInPlayerJoin.of(data);
                break;
            case 'PACKET_OUT_PLAYER_QUIT':
                packet = PacketInPlayerQuit.of(data);
                break;
            case 'PACKET_OUT_GAME_END':
                packet = PacketInGameEnd.of(data);
                break;
            case 'PACKET_OUT_EXCEPTION':
                throw new Error(`Received exception packet: ${data.message}`);
            default:
                throw new Error(`Unexpected packet: ${data.type}`);
        }

        return packet;
    };
}
