import { Player } from '../../../types';
import Packet from '../Packet';

export default class PacketInPlayerQuit extends Packet {
    private readonly player: Player;

    constructor(player: Player) {
        super();
        this.player = player;
    }

    public getPlayer = () => this.player;

    public static of = (obj: any) => new PacketInPlayerQuit(obj.player);
}
