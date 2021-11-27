import { Button } from '@vechaiui/button';
import router from 'next/router';
import { FunctionComponent, useEffect } from 'react';
import PacketInGameEnd from '../../scripts/packets/in/PacketInGameEnd';
import GameSocket from '../../scripts/socket/GameSocket';
import PopupMenu from './PopupMenu';

const GameEndPopupMenu: FunctionComponent<{
    gameSocket: GameSocket;
    hidden?: boolean;
    onToggle: (state: boolean) => void;
}> = ({ gameSocket, hidden, onToggle }) => {
    let openFn: () => void;
    let closeFn: () => void;

    useEffect(() => {
        gameSocket.subscribe<PacketInGameEnd>('game-end', () => {
            openFn();
        });
    }, []);

    if (hidden) return null;

    return (
        <PopupMenu
            setOpenFn={(fn) => {
                openFn = () => {
                    fn();
                    onToggle(true);
                };
            }}
            setCloseFn={(fn) => {
                closeFn = () => {
                    fn();
                    onToggle(false);
                };
            }}
        >
            <h1 className="text-5xl font-bold">Game ended.</h1>
            <div className="mt-8 gap-8 flex justify-center">
                <Button
                    size="lg"
                    type="button"
                    variant="solid"
                    color="primary"
                    onClick={() => router.push('/')}
                >
                    Main Menu
                </Button>
            </div>
        </PopupMenu>
    );
};

GameEndPopupMenu.defaultProps = {
    hidden: false,
};

export default GameEndPopupMenu;
