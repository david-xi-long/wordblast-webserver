import { IconButton } from '@vechaiui/button';
import { Input } from '@vechaiui/forms';
import { Icon } from '@vechaiui/icon';
import { Switch } from '@vechaiui/switch';
import { FunctionComponent, useRef, useState } from 'react';
import useOutsideClick from '../../hooks/outsideClick';
import Close from '../icons/Close';
import Cog from '../icons/Cog';

const SettingOption: FunctionComponent<{
    disabled: boolean;
    setting: string;
    settings: any;
    setSetting: (setting: string, value: string | boolean) => void;
}> = ({ disabled, setting, settings, setSetting }) => (
    <div className="w-full flex justify-between items-center">
        <h2 className="text-neutral-300 font-semibold text-lg">
            {settings[setting].title}
        </h2>
        {settings[setting].selectorType === 'input' && (
            <Input
                className="max-w-[75px]"
                size="xs"
                value={settings[setting].value}
                onChange={(e) => setSetting(setting, e.target.value)}
                disabled={disabled}
            />
        )}
        {settings[setting].selectorType === 'checkbox' && (
            <Switch
                checked={settings[setting].value}
                onChange={(e) => setSetting(setting, e.target.checked)}
                disabled={disabled}
            />
        )}
    </div>
);

const SettingsModal: FunctionComponent<{
    disabled: boolean;
    closeModal: () => void;
    settings: any;
    setSetting: (setting: string, value: string | boolean) => void;
}> = ({ disabled, closeModal, settings, setSetting }) => (
    <div className="min-w-[300px] p-6 bg-neutral-800 rounded-md">
        <div className="flex justify-between items-baseline">
            <h1 className="font-bold text-2xl mb-2">Settings</h1>
            <IconButton variant="ghost" size="sm" onClick={closeModal}>
                <Icon as={Close} label="Edit username" className="h-4 w-4" />
            </IconButton>
        </div>

        <div className="space-y-1.5">
            {Object.keys(settings).map((k) => (
                <SettingOption
                    key={k}
                    setting={k}
                    settings={settings}
                    setSetting={setSetting}
                    disabled={disabled}
                />
            ))}
        </div>
    </div>
);

const Settings: FunctionComponent<{
    disabled: boolean;
    settings: any;
    setSetting: (setting: string, value: string | boolean) => void;
}> = ({ disabled, settings, setSetting }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const ref = useRef(null);

    useOutsideClick(ref, () => setIsSettingsOpen(false));

    return (
        <div className="relative mt-4 mr-4" ref={ref}>
            {!isSettingsOpen && (
                <IconButton
                    variant="ghost"
                    size="md"
                    className="absolute right-0"
                    onClick={() => setIsSettingsOpen((curValue) => !curValue)}
                >
                    <Icon as={Cog} label="Edit username" className="h-6 w-6" />
                </IconButton>
            )}

            {isSettingsOpen && (
                <div className="absolute right-0">
                    <SettingsModal
                        settings={settings}
                        setSetting={setSetting}
                        closeModal={() => setIsSettingsOpen(false)}
                        disabled={disabled}
                    />
                </div>
            )}
        </div>
    );
};

export default Settings;
