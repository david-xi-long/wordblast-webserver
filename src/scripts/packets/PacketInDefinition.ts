import Packet from './Packet';

export default class PacketInDefinition extends Packet{
    private readonly word: string;
    private readonly definition: string;

    constructor(word: string, definition: string) {
        super();
        this.word = word;
        this.definition = definition;
    }

    public getWord = () => this.word;
    public getDefinition = () => this.definition;

    public static of = (obj:any) => new PacketInDefinition(obj.word, obj.definition);
}