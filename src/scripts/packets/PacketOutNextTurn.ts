import Packet from './Packet';

export default class PacketOutNextTurn extends Packet {
    private readonly gameUid: string;
    private readonly outOfTime: boolean;

    constructor(gameUid: string, outOfTime: boolean) {
        super();
        this.gameUid = gameUid;
        this.outOfTime = outOfTime;
    }

    public getGameUid = () => this.gameUid;
    public getOutOfTime = () => this.outOfTime;
}