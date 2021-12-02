export default class PacketOutGameJoin {
    private readonly gameUid: string;
    private readonly username: string;
    private readonly playerUid: string | undefined;

    constructor(gameUid: string, username: string, playerUid: string | undefined) {
        this.gameUid = gameUid;
        this.username = username;
        this.playerUid = playerUid;
    }

    public getGameUid = () => this.gameUid;
    public getUsername = () => this.username;
    public getPlayerUid = () => this.playerUid;
}
