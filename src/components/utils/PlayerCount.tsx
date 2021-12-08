import { FunctionComponent, useEffect, useState } from 'react';
import getGameEndpoint from '../../scripts/utils/endpoint';
import { handleErr } from '../../scripts/utils/error';

const PlayerCount: FunctionComponent = () => {
    const [onlineCount, setOnlineCount] = useState<number | undefined>();

    const getPlayerCount = async () => {
        const [response] = await handleErr(
            fetch(`${getGameEndpoint()}/api/game/count`)
        );
        if (response == null) return;

        const { count } = await response.json();

        setOnlineCount(count);
    };

    useEffect(() => {
        getPlayerCount();

        const id = setInterval(getPlayerCount, 10000);

        return () => {
            clearInterval(id);
        };
    }, []);

    return (
        <>
            {onlineCount !== undefined && (
                <span className="absolute right-2 bottom-2 py-1.5 px-2.5 bg-neutral-800 rounded-md self-end">
                    <p className="text-xs md:text-base font-semibold">
                        {onlineCount} playing
                    </p>
                </span>
            )}
        </>
    );
};

export default PlayerCount;
