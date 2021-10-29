import PlayerInfo from '../game/PlayerInfo';
import Packet from './Packet';

export default class PacketInGameInfo extends Packet {
    private readonly gameUid: string;
    private readonly status: string;
    private readonly activePlayerInfos: PlayerInfo[];

    constructor(
        gameUid: string,
        status: string,
        activePlayerInfos: PlayerInfo[]
    ) {
        super();
        this.gameUid = gameUid;
        this.status = status;
        this.activePlayerInfos = activePlayerInfos;
    }

    public getGameUid = () => this.gameUid;
    public getStatus = () => this.status;
    public getActivePlayerInfos = () => this.activePlayerInfos;

    public static of = (obj: any) =>
        new PacketInGameInfo(
            obj.gameUid,
            obj.status,
            obj.activePlayerInfos.map(
                (i) => new PlayerInfo(i.username, i.ready)
            )
        );
}
