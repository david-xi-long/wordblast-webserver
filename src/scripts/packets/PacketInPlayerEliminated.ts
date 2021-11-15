export default class PacketInPlayerEliminated {
    private readonly username: string;

    constructor(username: string) {
        this.username = username;
    }

    public getUsername = () => this.username;

    public static of = (obj: any) => new PacketInPlayerEliminated(obj.username);
}
