import { FunctionComponent } from 'react';

const GameCodeCard: FunctionComponent<{ gameSid: string; className?: string }> =
    ({ gameSid, className }) => (
        <div
            className={`m-4 ml-0 px-4 py-2 bg-neutral-800 rounded-md ${className}`}
        >
            <p className="text-neutral-100 font-semibold leading-tight">
                Game Code
            </p>
            <h2 className="text-white font-bold text-2xl leading-tight">
                {gameSid}
            </h2>
        </div>
    );

GameCodeCard.defaultProps = {
    className: '',
};

export default GameCodeCard;
