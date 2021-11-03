import { FunctionComponent, useEffect, useState } from 'react';
import GameSocket from '../../scripts/game/GameSocket';
import PacketInSettingChange from '../../scripts/packets/PacketInSettingChange';
import PacketOutSettingChange from '../../scripts/packets/PacketOutSettingChange';
import Settings from './Settings';

const gameSettingsInfo = {
    public: {
        selectorType: 'switch',
        title: 'Public',
        valueType: 'boolean',
    },
    playerLives: {
        selectorType: 'input',
        title: 'Player Lives',
        valueType: 'number',
    },
    timePerPlayer: {
        selectorType: 'input',
        title: 'Time Per Player',
        valueType: 'number',
    },
    extraLives: {
        selectorType: 'switch',
        title: 'Extra Lives',
        valueType: 'boolean',
    },
    increasingDifficulty: {
        selectorType: 'switch',
        title: 'Increasing Difficulty',
        valueType: 'boolean',
    },
};

const GameSettings: FunctionComponent<{
    disabled: boolean;
    gameId: string;
    gameSocket: GameSocket;
    isOwner: boolean;
    initialSettingValues: Record<string, string> | undefined;
}> = ({ disabled, gameId, gameSocket, isOwner, initialSettingValues }) => {
    const [settings, setSettings] = useState<any>();

    const setSetting = (
        setting: string,
        value: string | number | boolean,
        initial = false
    ) => {
        let newValue: string | number | boolean;

        switch (gameSettingsInfo[setting].valueType) {
            case 'boolean':
                newValue = value === 'true';
                break;
            default:
                newValue = value;
        }

        setSettings((curSettings) => ({
            ...curSettings,
            [setting]: {
                ...gameSettingsInfo[setting],
                value: newValue,
            },
        }));

        if (initial || !isOwner) return;

        gameSocket.fireAndForget(
            'setting-change',
            new PacketOutSettingChange(gameId, setting, `${value}`)
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
