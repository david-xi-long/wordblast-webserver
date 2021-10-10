import Packet from './Packet';

export default class PacketInGameInfo extends Packet {
    private readonly gameUid: string;
    private readonly status: string;
    private readonly playerNames: string[];

    constructor(gameUid: string, status: string, playerNames: string[]) {
        super();
        this.gameUid = gameUid;
        this.status = status;
        this.playerNames = playerNames;
    }

    public getGameUid = () => this.gameUid;
    public getStatus = () => this.status;
    public getPlayerNames = () => this.playerNames;

    public static of = (obj: any) =>
        new PacketInGameInfo(obj.gameUid, obj.status, obj.playerNames);
}
