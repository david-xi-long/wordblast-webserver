import { ActionIcon, Switch, Textarea, TextInput } from '@mantine/core';
import { FunctionComponent, useRef, useState } from 'react';
import useOutsideClick from '../../hooks/outsideClick';
import { Setting, SettingsMap } from '../../types';
import Close from '../icons/Close';
import Cog from '../icons/Cog';

const SettingOption: FunctionComponent<{
    disabled: boolean;
    settingName: string;
    setting: Setting;
    setSetting: (settingName: string, value: string | boolean) => void;
}> = ({ disabled, settingName, setting, setSetting }) => (
    <div className="w-full flex justify-between items-center">
        <h2 className="text-neutral-300 font-semibold text-lg">
            {setting.title}
        </h2>

        {setting.settingType === 'switch' && (
            <Switch
                checked={setting.value as boolean}
                onChange={(e) => setSetting(settingName, e.target.checked)}
                disabled={disabled}
            />
        )}

        {setting.settingType === 'textinput' && (
            <TextInput
                size="xs"
                value={setting.value as string}
                onChange={(e) => setSetting(settingName, e.target.value)}
                disabled={disabled}
                className="max-w-[75px]"
            />
        )}

        {setting.settingType === 'textarea' && (
            <Textarea
                value={
                    disabled
                        ? setting.hideIfDisabled
                            ? 'Hidden'
                            : (setting.value as string)
                        : (setting.value as string)
                }
                onChange={(e) => setSetting(settingName, e.target.value)}
                disabled={disabled}
            />
        )}
    </div>
);

const SettingsModal: FunctionComponent<{
    disabled: boolean;
    closeModal: () => void;
    settings: SettingsMap;
    setSetting: (settingName: string, value: string | boolean) => void;
}> = ({ disabled, closeModal, settings, setSetting }) => (
    <div className="min-w-[300px] p-6 bg-neutral-800 rounded-md">
        <div className="flex justify-between items-baseline">
            <h1 className="font-bold text-2xl mb-2">Settings</h1>
            <ActionIcon variant="transparent" onClick={closeModal}>
                <Close className="h-4 w-4" />
            </ActionIcon>
        </div>

        <div className="space-y-1.5">
            {Object.entries(settings).map(([settingName, setting]) => (
                <SettingOption
                    key={settingName}
                    settingName={settingName}
                    setting={setting}
                    setSetting={setSetting}
                    disabled={disabled}
                />
            ))}
        </div>
    </div>
);

const Settings: FunctionComponent<{
    disabled: boolean;
    settings: SettingsMap;
    setSetting: (settingName: string, value: string | boolean) => void;
}> = ({ disabled, settings, setSetting }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const ref = useRef(null);

    useOutsideClick(ref, () => setIsSettingsOpen(false));

    return (
        <div className="relative h-0 w-0 mt-4 mr-4" ref={ref}>
            <span className="absolute right-0">
                {!isSettingsOpen && (
                    <ActionIcon
                        variant="light"
                        size="lg"
                        onClick={() =>
                            setIsSettingsOpen((curValue) => !curValue)
                        }
                    >
                        <Cog className="h-6 w-6" />
                    </ActionIcon>
                )}
                {isSettingsOpen && (
                    <SettingsModal
                        settings={settings}
                        setSetting={setSetting}
                        closeModal={() => setIsSettingsOpen(false)}
                        disabled={disabled}
                    />
                )}
            </span>
        </div>
    );
};

export default Settings;
