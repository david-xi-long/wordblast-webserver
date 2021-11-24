import { Button } from '@vechaiui/button';
import { FunctionComponent, useEffect, useState } from 'react';
import GameSocket from '../../scripts/socket/GameSocket';
import GamePlayPage from './GamePlayPage';

const env = 'dev';
const endpoints = {
    dev: 'http://localhost:8080/api/game/',
    prod: 'http://localhost:8080/api/game/',
};

const SinglePlayerLobby: FunctionComponent = () => {
    const [isReady, setIsReady] = useState(false);
    const [gameSocket] = useState(new GameSocket());

    if (isReady) {
        return <GamePlayPage />;
    }

    const startGame = async () => {
        setIsReady(true);
    };

    return (
        <>
            <div>
                <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    size="lg"
                    onClick={startGame}
                >
                    Ready?
                </Button>
            </div>
        </>
    );
};

export default SinglePlayerLobby;
