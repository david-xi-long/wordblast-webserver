import Packet from './Packet';

export default class PacketOutSettingChange extends Packet {
    private readonly gameUid: string;
    private readonly setting: string;
    private readonly value: string;

    constructor(gameUid: string, setting: string, value: string) {
        super();
        this.gameUid = gameUid;
        this.setting = setting;
        this.value = value;
    }

    public getGameUid = () => this.gameUid;
    public getSetting = () => this.setting;
    public getValue = () => this.value;
}
