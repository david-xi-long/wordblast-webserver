import Packet from './Packet';

export default class PacketInSelectUsername extends Packet {
    private readonly exists: boolean;

    constructor(exists: boolean) {
        super();
        this.exists = exists;
    }

    public usernameExists = () => this.exists;

    public static of = (obj: any) => new PacketInSelectUsername(obj.exists);
}
