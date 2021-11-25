export interface Player {
    username: string;
    ready: boolean;
    lives: number;
}

export interface RoundInfo {
    round: number;
    username: string;
    timeRemaining: number;
    turnLength: number;
    sentAt: Date;
    previousPlayer: string;
    notificationText: string;
    letterCombo: string;
}
