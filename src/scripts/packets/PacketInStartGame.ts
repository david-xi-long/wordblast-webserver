import Packet from './Packet';

export default class PacketInStartGame extends Packet {
    private readonly gameUid: string;
    private readonly players: string[];
    
    constructor(gameUid: string, players: string[]) {
        super();
        this.gameUid = gameUid;
        this.players = players;
    }

    public getGameUid = () => this.gameUid;
    public getPlayers = () => this.players;

    public static of = (obj: any) => new PacketInStartGame(obj.gameUid, obj.players);
}