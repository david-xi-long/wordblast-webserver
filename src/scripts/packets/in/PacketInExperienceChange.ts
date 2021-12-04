export default class PacketInExperienceChange {
    private readonly username: string;
    private readonly experienceDelta: number;

    constructor(username: string, experienceDelta: number) {
        this.username = username;
        this.experienceDelta = experienceDelta;
    }

    public getUsername = () => this.username;
    public getExperienceDelta = () => this.experienceDelta;

    public static of = (obj) =>
        new PacketInExperienceChange(obj.username, obj.experienceDelta);
}
