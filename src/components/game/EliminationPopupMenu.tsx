import { Button } from '@mantine/core';
import router from 'next/router';
import { FunctionComponent, useEffect } from 'react';
import PacketInPlayerEliminated from '../../scripts/packets/in/PacketInPlayerEliminated';
import GameSocket from '../../scripts/socket/GameSocket';
import PopupMenu from './PopupMenu';

const EliminationPopupMenu: FunctionComponent<{
    username: string;
    gameSocket: GameSocket;
    hidden?: boolean;
    onToggle: (state: boolean) => void;
}> = ({ username, gameSocket, hidden, onToggle }) => {
    let openFn: () => void;
    let closeFn: () => void;

    useEffect(() => {
        gameSocket.subscribe<PacketInPlayerEliminated>(
            'player-eliminated',
            (packet) => {
                if (packet.getUsername() !== username) return;
                openFn();
            }
        );
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
            <h1 className="text-5xl font-bold text-center">
                You have been eliminated.
            </h1>
            <div className="mt-8 gap-8 flex justify-center">
                <Button
                    type="button"
                    size="md"
                    onClick={() => router.push('/')}
                >
                    Main Menu
                </Button>
                <Button type="button" size="md" onClick={() => closeFn()}>
                    Spectate
                </Button>
            </div>
        </PopupMenu>
    );
};

EliminationPopupMenu.defaultProps = {
    hidden: false,
};

export default EliminationPopupMenu;
