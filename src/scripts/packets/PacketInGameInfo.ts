import Packet from './Packet';

export default class PacketInGameInfo extends Packet {
    private readonly gameUid: string;
    private readonly status: string;
    private readonly activePlayerNames: string[];

    constructor(gameUid: string, status: string, activePlayerNames: string[]) {
        super();
        this.gameUid = gameUid;
        this.status = status;
        this.activePlayerNames = activePlayerNames;
    }

    public getGameUid = () => this.gameUid;
    public getStatus = () => this.status;
    public getActivePlayerNames = () => this.activePlayerNames;

    public static of = (obj: any) =>
        new PacketInGameInfo(obj.gameUid, obj.status, obj.activePlayerNames);
}
