export default class PacketOutGameJoin {
    private readonly gameUid: string;
    private readonly username: string;
    private readonly playerUid: string | undefined;
    private readonly bigHeadOptions: Record<string, string | boolean>;

    constructor(
        gameUid: string,
        username: string,
        playerUid: string | undefined,
        bigHeadOptions: Record<string, string | boolean>
    ) {
        this.gameUid = gameUid;
        this.username = username;
        this.playerUid = playerUid;
        this.bigHeadOptions = bigHeadOptions;
    }

    public getGameUid = () => this.gameUid;
    public getUsername = () => this.username;
    public getPlayerUid = () => this.playerUid;
    public getBigHeadOptions = () => this.bigHeadOptions;
}
