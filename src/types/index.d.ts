export interface Player {
    username: string;
    bigHeadOptions: Record<string, string | boolean>;
    ready: boolean;
    lives: number;
    experience: number;
    experienceDelta: number;
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

export type SettingType = 'switch' | 'textinput' | 'textarea';
export type SettingValueType = boolean | number | string;

export interface Setting {
    settingType: SettingType;
    title: string;
    valueType: 'boolean' | 'number' | 'string';
    hideIfDisabled: boolean;
    value?: SettingValueType;
}

export type SettingsMap = { [settingName: string]: Setting };
