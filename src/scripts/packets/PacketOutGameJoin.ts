export default class PacketOutGameJoin {
    private readonly gameUid: string;
    private readonly username: string;

    constructor(gameUid: string, username: string) {
        this.gameUid = gameUid;
        this.username = username;
    }

    public getGameUid = () => this.gameUid;
    public getUsername = () => this.username;
}
