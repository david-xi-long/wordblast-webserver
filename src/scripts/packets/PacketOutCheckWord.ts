import Packet from './Packet';

export default class PacketOutCheckWord extends Packet {
    private readonly word: string;
    private readonly gameUid: string;

    constructor(word: string, gameUid: string) {
        super();
        this.word = word;
        this.gameUid = gameUid;
    }

    public getWord = () => this.word;
    public getGameUid = () => this.gameUid;
}