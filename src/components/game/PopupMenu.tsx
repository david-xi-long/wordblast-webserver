import { FunctionComponent, useState } from 'react';
import slideInUp from 'react-animations/lib/slideInUp';
import fadeIn from 'react-animations/lib/fadeIn';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
    slide: {
        animationName: slideInUp,
        animationDuration: '2s',
    },
    fade: {
        animationName: fadeIn,
        animationDuration: '2s',
    },
});

const PopupMenu: FunctionComponent<{
    setOpenFn: (fn: () => void) => void;
    setCloseFn: (fn: () => void) => void;
}> = ({ setOpenFn, setCloseFn, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };
    const close = () => {
        setIsOpen(false);
    };

    setOpenFn(open);
    setCloseFn(close);

    if (!isOpen) return <></>;

    return (
        <div className="absolute h-screen w-screen bg-black bg-opacity-95 flex flex-col justify-center items-center z-50">
            <div className={css(styles.slide, styles.fade)}>{children}</div>
        </div>
    );
};

export default PopupMenu;
