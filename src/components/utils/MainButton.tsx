import { FunctionComponent } from 'react';

const MainButton: FunctionComponent<{
    disabled?: boolean;
    onClick?: () => void;
}> = ({ disabled, onClick, children }) => (
    <button
        type="button"
        disabled={disabled}
        className={`px-3.5 pr-4 py-2.5 bg-neutral-900 hover:bg-neutral-900/80 ring-1 ring-neutral-800 rounded-md flex items-center ${
            disabled
                ? 'cursor-not-allowed opacity-50'
                : 'active:translate-y-[0.05rem] opacity-100'
        }`}
        onClick={onClick}
    >
        {children}
    </button>
);

MainButton.defaultProps = {
    disabled: false,
    onClick: () => {},
};

export default MainButton;
