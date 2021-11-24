import Packet from '../Packet';

export default class PacketInUsernameSelect extends Packet {
    private readonly usernameExists: string;

    constructor(usernameExists: string) {
        super();
        this.usernameExists = usernameExists;
    }

    public getUsernameExists = () => this.usernameExists;

    public static of = (obj: any) =>
        new PacketInUsernameSelect(obj.usernameExists);
}
