import Packet from './Packet';

export default class PacketInRoundInfo extends Packet {
    private readonly gameUid: string;
    private readonly round: number;
    private readonly player: string;
    private readonly timeRemaining: number;

    constructor(
        gameUid: string,
        round: number,
        player: string,
        timeRemaining: number
    ) {
        super();
        this.gameUid = gameUid;
        this.round = round;
        this.player = player;
        this.timeRemaining = timeRemaining;
    }

    public getGameUid = () => this.gameUid;
    public getRound = () => this.round;
    public getPlayer = () => this.player;
    public getTimeRemaining = () => this.timeRemaining;

    public static of = (obj: any) =>
        new PacketInRoundInfo(
            obj.gameUid,
            obj.round,
            obj.player,
            obj.timeRemaining
        );
}
