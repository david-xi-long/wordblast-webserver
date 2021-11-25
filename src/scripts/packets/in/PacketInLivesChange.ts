import Packet from '../Packet';

export default class PacketInLivesChange extends Packet {
    private readonly username: string;
    private readonly lives: number;

    constructor(username: string, lives: number) {
        super();
        this.username = username;
        this.lives = lives;
    }

    public getUsername = () => this.username;
    public getLives = () => this.lives;

    public static of = (obj: any) =>
        new PacketInLivesChange(obj.username, obj.lives);
}
