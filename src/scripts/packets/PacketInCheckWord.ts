import Packet from './Packet';

export default class PacketInCheckWord extends Packet{
    private readonly valid: boolean;

    constructor(valid: boolean) {
        super();
        this.valid = valid;
    }

    public wordIsValid = () => this.valid;

    public static of = (obj:any) => new PacketInCheckWord(obj.exists);
}