import { FunctionComponent, useEffect, useState } from 'react';
import { handleErr } from '../../scripts/utils/error';

const PlayerCount: FunctionComponent = () => {
    const [onlineCount, setOnlineCount] = useState<number | undefined>();

    const getPlayerCount = async () => {
        const [response] = await handleErr(
            fetch('http://localhost:8080/api/game/count')
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
                <span className="mb-2 mr-2 py-2 px-3 bg-neutral-700 rounded-md self-end">
                    <p className="text-sm md:text-lg font-semibold">
                        {onlineCount} playing
                    </p>
                </span>
            )}
        </>
    );
};

export default PlayerCount;
