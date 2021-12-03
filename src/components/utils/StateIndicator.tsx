import { FunctionComponent } from 'react';

const StateIndicator: FunctionComponent<{ ready: boolean }> = ({ ready }) => (
    <div
        className={`h-2.5 w-2.5 rounded-full ${
            ready ? 'bg-green-500' : 'bg-red-500'
        }`}
    />
);

export default StateIndicator;
