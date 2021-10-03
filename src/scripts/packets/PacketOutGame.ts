import Packet from './Packet';

export default class PacketOutGame extends Packet {
    private readonly gameUid: string;
    private readonly playerUid: string;

    constructor(gameUid: string, playerUid: string) {
        super();
        this.gameUid = gameUid;
        this.playerUid = playerUid;
    }

    public getGameUid = () => this.gameUid;
    public getPlayerUid = () => this.playerUid;
}
