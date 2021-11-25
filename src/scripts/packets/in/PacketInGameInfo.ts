import { Player } from '../../../types';
import Packet from '../Packet';

export default class PacketInGameInfo extends Packet {
    private readonly gameUid: string;
    private readonly status: string;
    private readonly activePlayerInfos: Player[];
    private readonly ownerUid: string;
    private readonly settings: Record<string, string>;

    constructor(
        gameUid: string,
        status: string,
        activePlayerInfos: Player[],
        ownerUid: string,
        settings: Record<string, string>
    ) {
        super();
        this.gameUid = gameUid;
        this.status = status;
        this.activePlayerInfos = activePlayerInfos;
        this.ownerUid = ownerUid;
        this.settings = settings;
    }

    public getGameUid = () => this.gameUid;
    public getStatus = () => this.status;
    public getActivePlayerInfos = () => this.activePlayerInfos;
    public getOwnerUid = () => this.ownerUid;
    public getSettings = () => this.settings;

    public static of = (obj: any) =>
        new PacketInGameInfo(
            obj.gameUid,
            obj.status,
            obj.activePlayerInfos,
            obj.ownerUid,
            obj.settings
        );
}
