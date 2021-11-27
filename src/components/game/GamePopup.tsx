import { FunctionComponent, useState } from 'react';
import GameSocket from '../../scripts/socket/GameSocket';
import EliminationPopupMenu from './EliminationPopupMenu';
import GameEndPopupMenu from './GameEndPopupMenu';

const GamePopup: FunctionComponent<{
    username: string;
    gameSocket: GameSocket;
}> = ({ username, gameSocket }) => {
    const [isElimMenuOpen, setIsElimMenuOpen] = useState(false);
    const [isEndMenuOpen, setIsEndMenuOpen] = useState(false);

    return (
        <>
            <EliminationPopupMenu
                username={username}
                gameSocket={gameSocket}
                hidden={isEndMenuOpen}
                onToggle={(state) => setIsElimMenuOpen(state)}
            />
            <GameEndPopupMenu
                gameSocket={gameSocket}
                onToggle={(state) => setIsEndMenuOpen(state)}
            />
        </>
    );
};

export default GamePopup;
