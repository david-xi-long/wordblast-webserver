import Packet from './Packet';

export default class PacketInGameInfo extends Packet {
    private readonly gameUid: string;
    private readonly playerUids: string[];

    constructor(gameUid: string, playerUids: string[]) {
        super();
        this.gameUid = gameUid;
        this.playerUids = playerUids;
    }

    public getGameUid = () => this.gameUid;
    public getPlayerUids = () => this.playerUids;

    public static of = (obj: any) =>
        new PacketInGameInfo(obj.gameUid, obj.playerUids);
}
