export default class PacketOutGameJoin {
    private readonly gameUid: string;
    private readonly username: string;
    private readonly userUid: string | undefined;
    private readonly bigHeadOptions: Record<string, string | boolean>;

    constructor(
        gameUid: string,
        username: string,
        userUid: string | undefined,
        bigHeadOptions: Record<string, string | boolean>
    ) {
        this.gameUid = gameUid;
        this.username = username;
        this.userUid = userUid;
        this.bigHeadOptions = bigHeadOptions;
    }

    public getGameUid = () => this.gameUid;
    public getUsername = () => this.username;
    public getPlayerUid = () => this.userUid;
    public getBigHeadOptions = () => this.bigHeadOptions;
}
