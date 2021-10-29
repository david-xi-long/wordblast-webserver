import Packet from './Packet';

export default class PacketOutPlayerReadyState extends Packet {
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
}
