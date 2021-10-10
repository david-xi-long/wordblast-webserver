import Packet from './Packet';

export default class PacketInPlayerState extends Packet {
    private readonly username: string;
    private readonly state: boolean;

    constructor(username: string, state: boolean) {
        super();
        this.username = username;
        this.state = state;
    }

    public getUsername = () => this.username;
    public getState = () => this.state;

    public static of = (obj: any) =>
        new PacketInPlayerState(obj.username, obj.state);
}
