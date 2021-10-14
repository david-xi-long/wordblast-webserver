import { cx } from '@vechaiui/utils';
import { FunctionComponent } from 'react';

const Card: FunctionComponent<{ className?: string }> = ({
    children,
    className,
}) => (
    <div
        className={cx(
            className,
            'relative',
            'flex flex-col',
            'bg-white border-gray-200 border',
            'dark:bg-neutral-800 dark:border-neutral-700',
            'rounded shadow-lg'
        )}
    >
        {children}
    </div>
);

Card.defaultProps = {
    className: '',
};

export default Card;
