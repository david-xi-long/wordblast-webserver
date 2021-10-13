import Packet from './Packet';

export default class PacketInPlayerMessage extends Packet {
    private readonly gameUid: string;
    private readonly username: string;
    private readonly message: string;

    constructor(gameUid: string, username: string, message: string) {
        super();
        this.gameUid = gameUid;
        this.username = username;
        this.message = message;
    }

    public getGameUid = () => this.gameUid;
    public getUsername = () => this.username;
    public getMessage = () => this.message;

    public static of = (obj: any) =>
        new PacketInPlayerMessage(obj.gameUid, obj.username, obj.message);
}

