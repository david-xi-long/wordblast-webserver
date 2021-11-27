import { Button } from '@vechaiui/button';
import router from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import PacketInPlayerEliminated from '../../scripts/packets/in/PacketInPlayerEliminated';
import GameSocket from '../../scripts/socket/GameSocket';
import PopupMenu from './PopupMenu';

const EliminationPopupMenu: FunctionComponent<{
    username: string;
    gameSocket: GameSocket;
}> = ({ username, gameSocket }) => {
    let openFn: () => void;
    let closeFn: () => void;

    const registerInitHandlers = () => {
        gameSocket.subscribe<PacketInPlayerEliminated>(
            'player-eliminated',
            (packet) => {
                if (packet.getUsername() !== username) return;
                openFn();
            }
        );
    };

    useEffect(() => {
        registerInitHandlers();
    }, []);

    return (
        <PopupMenu
            setOpenFn={(fn) => {
                openFn = fn;
            }}
            setCloseFn={(fn) => {
                closeFn = fn;
            }}
        >
            <h1 className="text-5xl font-bold">You have been eliminated.</h1>
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
                <Button
                    size="lg"
                    type="button"
                    variant="solid"
                    color="primary"
                    onClick={() => closeFn()}
                >
                    Spectate
                </Button>
            </div>
        </PopupMenu>
    );
};

export default EliminationPopupMenu;
