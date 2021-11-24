import Packet from '../Packet';

export default class PacketInUsernameChange extends Packet {
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

    public static of = (obj: any) =>
        new PacketInUsernameChange(
            obj.gameUid,
            obj.oldUsername,
            obj.newUsername
        );
}
