import { cx } from '@vechaiui/utils';
import { FunctionComponent } from 'react';

export const Card: FunctionComponent = ({ children }) => (
    <div
        className={cx(
            'relative flex flex-col w-full mx-auto my-24 rounded shadow-lg',
            'bg-white border border-gray-200',
            'dark:bg-neutral-800 dark:border-neutral-700',
            'max-w-md'
        )}
    >
        {children}
    </div>
);

export default Card;
