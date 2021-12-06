import { FunctionComponent, useEffect, useState } from 'react';
import slideOutDown from 'react-animations/lib/slideOutDown';
import fadeOut from 'react-animations/lib/fadeOut';
import { StyleSheet, css } from 'aphrodite';
import PacketInExperienceChange from '../../scripts/packets/in/PacketInExperienceChange';
import GameSocket from '../../scripts/socket/GameSocket';
import { uid } from '../../scripts/utils/math';
import { Player } from '../../types';

interface Animation {
    id: string;
    data: Record<string, unknown>;
    relPos: { x: number; y: number };
    // eslint-disable-next-line no-undef
    timeout: NodeJS.Timeout;
}

const animationStyles = StyleSheet.create({
    slideOut: {
        animationName: slideOutDown,
        animationDuration: '3s',
    },
    fadeOut: {
        animationName: fadeOut,
        animationDuration: '3s',
    },
});

const ExperienceAnimator: FunctionComponent<{
    gameSocket: GameSocket;
    player: Player;
}> = ({ gameSocket, player }) => {
    const [animations, setAnimations] = useState<Animation[]>([]);

    const addAnimation = (animation: Animation) => {
        setAnimations((curAnimations) => [...curAnimations, animation]);
    };

    const removeAnimation = (animation: Animation) => {
        setAnimations((curAnimations) =>
            curAnimations.filter(
                (curAnimation) => curAnimation.id !== animation.id
            )
        );
    };

    const registerInitHandlers = () => {
        gameSocket.subscribe<PacketInExperienceChange>(
            'experience-change',
            (packet) => {
                if (packet.getUsername() !== player.username) return;

                const animation: Animation = {
                    id: uid(),
                    data: { xpDelta: packet.getExperienceDelta() },
                    relPos: {
                        x: Math.random() * 25,
                        y: Math.random() * 125,
                    },
                    timeout: setTimeout(() => removeAnimation(animation), 3000),
                };

                addAnimation(animation);
            }
        );
    };

    useEffect(() => {
        registerInitHandlers();

        return () => {
            animations.forEach((animation) => clearTimeout(animation.timeout));
        };
    }, []);

    if (animations.length === 0) return null;

    return (
        <>
            {animations.map((animation) => (
                <p
                    key={animation.id}
                    className={`absolute text-green-400 font-bold text-lg ${css(
                        animationStyles.slideOut,
                        animationStyles.fadeOut
                    )}`}
                    style={{
                        top: `${animation.relPos.y}px`,
                        right: `${animation.relPos.x}px`,
                    }}
                >
                    +{animation.data.xpDelta}
                </p>
            ))}
        </>
    );
};

export default ExperienceAnimator;
