import { FunctionComponent } from 'react';

const StateIndicator: FunctionComponent<{ ready: boolean }> = ({ ready }) => (
    <div
        className={`self-end h-3 w-3 rounded-full ${
            ready ? 'bg-green-500' : 'bg-red-500'
        }`}
    />
);

export default StateIndicator;
