import Packet from './Packet';

export default class PacketInRoundInfo extends Packet {
    private readonly gameUid: string;
    private readonly round: number;
    private readonly player: string;
    private readonly timeRemaining: number;
    private readonly players: string[];
    private readonly playerLives: number[];
    private readonly previousPlayer: string;
    private readonly notificationText: string;

    constructor(
        gameUid: string,
        round: number,
        player: string,
        timeRemaining: number,
        players: string[],
        playerLives: number[],
        previousPlayer: string,
        notificationText: string
    ) {
        super();
        this.gameUid = gameUid;
        this.round = round;
        this.player = player;
        this.timeRemaining = timeRemaining;
        this.players = players;
        this.playerLives = playerLives;
        this.previousPlayer = previousPlayer;
        this.notificationText = notificationText;
    }

    public getGameUid = () => this.gameUid;
    public getRound = () => this.round;
    public getPlayer = () => this.player;
    public getTimeRemaining = () => this.timeRemaining;
    public getPlayers = () => this.players;
    public getPlayerLives = () => this.playerLives;
    public getPreviousPlayer = () => this.previousPlayer;
    public getNotificationText = () => this.notificationText;

    public static of = (obj: any) =>
        new PacketInRoundInfo(
            obj.gameUid,
            obj.round,
            obj.player,
            obj.timeRemaining,
            obj.players,
            obj.playerLives,
            obj.previousPlayer,
            obj.notificationText
        );
}
