export default class PlayerInfo {
    private readonly username: string;
    private readonly ready: boolean;

    constructor(username: string, ready: boolean) {
        this.username = username;
        this.ready = ready;
    }

    public getUsername = () => this.username;
    public isReady = () => this.ready;
}
