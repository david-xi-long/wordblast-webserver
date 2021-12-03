export interface Player {
    username: string;
    bigHeadOptions: Record<string, string | boolean>;
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
