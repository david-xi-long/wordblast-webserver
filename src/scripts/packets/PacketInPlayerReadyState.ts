import Packet from './Packet';

export default class PacketInPlayerReadyState extends Packet {
    private readonly gameUid: string;
    private readonly username: string;
    private readonly ready: boolean;

    constructor(gameUid: string, username: string, ready: boolean) {
        super();
        this.gameUid = gameUid;
        this.username = username;
        this.ready = ready;
    }

    public getGameUid = () => this.gameUid;
    public getUsername = () => this.username;
    public isReady = () => this.ready;

    public static of = (obj: any) =>
        new PacketInPlayerReadyState(obj.gameUid, obj.username, obj.ready);
}
