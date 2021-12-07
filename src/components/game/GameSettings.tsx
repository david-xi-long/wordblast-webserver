import { FunctionComponent, useEffect, useState } from 'react';
import GameSocket from '../../scripts/socket/GameSocket';
import PacketInSettingChange from '../../scripts/packets/in/PacketInSettingChange';
import PacketOutSettingChange from '../../scripts/packets/out/PacketOutSettingChange';
import Settings from './Settings';
import { SettingsMap, SettingValueType } from '../../types';

const gameSettingsInfo: SettingsMap = {
    public: {
        settingType: 'switch',
        title: 'Public',
        valueType: 'boolean',
        hideIfDisabled: false,
    },
    playerLives: {
        settingType: 'textinput',
        title: 'Player Lives',
        valueType: 'number',
        hideIfDisabled: false,
    },
    timePerPlayer: {
        settingType: 'textinput',
        title: 'Time Per Player',
        valueType: 'number',
        hideIfDisabled: false,
    },
    extraLives: {
        settingType: 'switch',
        title: 'Extra Lives',
        valueType: 'boolean',
        hideIfDisabled: false,
    },
    increasingDifficulty: {
        settingType: 'switch',
        title: 'Increasing Difficulty',
        valueType: 'boolean',
        hideIfDisabled: false,
    },
    customWords: {
        settingType: 'textarea',
        title: 'Custom Words',
        valueType: 'string',
        hideIfDisabled: true,
    },
};

const GameSettings: FunctionComponent<{
    disabled: boolean;
    gameUid: string;
    gameSocket: GameSocket;
    isOwner: boolean;
    initialSettingValues: Record<string, string> | undefined;
}> = ({ disabled, gameUid, gameSocket, isOwner, initialSettingValues }) => {
    const [settings, setSettings] = useState<SettingsMap>({});

    const setSetting = (
        setting: string,
        value: SettingValueType,
        initial = false
    ) => {
        if (typeof value !== gameSettingsInfo[setting].valueType) {
            switch (gameSettingsInfo[setting].valueType) {
                case 'boolean':
                    value = value === 'true';
                    break;
                case 'number':
                    value = Number(value);
                    break;
                default:
            }
        }

        setSettings((curSettings) => ({
            ...curSettings,
            [setting]: {
                ...gameSettingsInfo[setting],
                value,
            },
        }));

        if (initial || !isOwner) return;

        gameSocket.fireAndForget(
            'setting-change',
            new PacketOutSettingChange(gameUid, setting, `${value}`)
        );
    };

    useEffect(() => {
        if (initialSettingValues === undefined) return;

        Object.entries(initialSettingValues).forEach(([setting, value]) =>
            setSetting(setting, value, true)
        );
    }, [initialSettingValues]);

    useEffect(() => {
        gameSocket.subscribe<PacketInSettingChange>(
            'setting-change',
            (packet) => {
                if (isOwner) return;
                setSetting(packet.getSetting(), packet.getValue());
            }
        );
    }, []);

    return (
        <Settings
            disabled={disabled}
            settings={settings}
            setSetting={setSetting}
        />
    );
};

export default GameSettings;
