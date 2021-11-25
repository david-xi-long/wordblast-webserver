import Packet from '../Packet';

export default class PacketInRoundInfo extends Packet {
    private readonly gameUid: string;
    private readonly round: number;
    private readonly player: string;
    private readonly timeRemaining: number;
    private readonly turnLength: number;
    private readonly players: string[];
    private readonly previousPlayer: string;
    private readonly notificationText: string;
    private readonly letterCombo: string;

    constructor(
        gameUid: string,
        round: number,
        player: string,
        timeRemaining: number,
        turnLength: number,
        players: string[],
        previousPlayer: string,
        notificationText: string,
        letterCombo: string
    ) {
        super();
        this.gameUid = gameUid;
        this.round = round;
        this.player = player;
        this.timeRemaining = timeRemaining;
        this.turnLength = turnLength;
        this.players = players;
        this.previousPlayer = previousPlayer;
        this.notificationText = notificationText;
        this.letterCombo = letterCombo;
    }

    public getGameUid = () => this.gameUid;
    public getRound = () => this.round;
    public getPlayer = () => this.player;
    public getTimeRemaining = () => this.timeRemaining;
    public getTurnLength = () => this.turnLength;
    public getPlayers = () => this.players;
    public getPreviousPlayer = () => this.previousPlayer;
    public getNotificationText = () => this.notificationText;
    public getLetterCombo = () => this.letterCombo;

    public static of = (obj: any) =>
        new PacketInRoundInfo(
            obj.gameUid,
            obj.round,
            obj.player,
            obj.timeRemaining,
            obj.turnLength,
            obj.players,
            obj.previousPlayer,
            obj.notificationText,
            obj.letterCombo
        );

    public toRoundInfo = () => ({
        round: this.getRound(),
        username: this.getPlayer(),
        timeRemaining: this.getTimeRemaining(),
        turnLength: this.turnLength,
        // TODO: ????
        sentAt: new Date(),
        players: this.getPlayers(),
        previousPlayer: this.getPreviousPlayer(),
        notificationText: this.getNotificationText(),
        letterCombo: this.getLetterCombo(),
    });
}
