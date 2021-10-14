import Packet from './Packet';

export default class PacketOutUsernameSelect extends Packet {
    private readonly gameUid: string;
    private readonly username: string;

    constructor(gameUid: string, username: string) {
        super();
        this.gameUid = gameUid;
        this.username = username;
    }

    public getGameUid = () => this.gameUid;
    public getUsername = () => this.username;
}
