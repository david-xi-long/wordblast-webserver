import Packet from '../Packet';

export default class PacketOutUsernameChange extends Packet {
    private readonly gameUid: string;
    private readonly oldUsername: string;
    private readonly newUsername: string;

    constructor(gameUid: string, oldUsername: string, newUsername: string) {
        super();
        this.gameUid = gameUid;
        this.oldUsername = oldUsername;
        this.newUsername = newUsername;
    }

    public getGameUid = () => this.gameUid;
    public getOldUsername = () => this.oldUsername;
    public getNewUsername = () => this.newUsername;
}
