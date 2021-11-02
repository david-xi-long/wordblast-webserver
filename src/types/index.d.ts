export interface Player {
    username: string;
    ready: boolean;
}

export interface RoundInfo {
    round: number;
    username: string;
    timeRemaining: number;
    sentAt: Date;
}
