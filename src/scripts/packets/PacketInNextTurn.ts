import Packet from './Packet';

export default class PacketInNextTurn extends Packet{
    private readonly letterCombo: string;
    private readonly timeToAnswer: number;

    constructor(letterCombo: string, timeToAnswer: number) {
        super();
        this.letterCombo = letterCombo;
        this.timeToAnswer = timeToAnswer;
    }

    public getLetterCombo = () => this.letterCombo;
    public getTimeToAnswer = () => this.timeToAnswer;

    public static of = (obj: any) => new PacketInNextTurn(obj.letterCombo, obj.timeToAnswer);
}