import { useState, useRef, FunctionComponent, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { cx, Button } from '@vechaiui/react';

interface PopupProps {
    title: string;
    message: string;
    buttonText: string;
    showWarning: boolean;
    onWarning: Function;
}

const Popup: FunctionComponent<PopupProps> = ({
    title,
    message,
    buttonText,
    showWarning,
    onWarning,
}) => {
    const completeButtonRef = useRef(null);
    // const hanldeOpen = () => setShowDialog(showWarning);
    const handleClose = () => {
        onWarning(false);
    };

    return (
        <Transition show={showWarning} as={Fragment}>
            <Dialog
                initialFocus={completeButtonRef}
                as="div"
                className="fixed inset-0 overflow-y-auto z-modal"
                open={showWarning}
                onClose={handleClose}
            >
                <Dialog.Overlay className="fixed top-0 left-0 w-screen h-screen bg-blackAlpha-600" />
                <Transition.Child
                    as={Fragment}
                    enter="transition ease-out duration-150"
                    enterFrom="transform scale-95"
                    enterTo="transform scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="transform scale-100"
                    leaveTo="transform scale-95"
                >
                    <div
                        className={cx(
                            'relative flex flex-col w-full mx-auto my-24 rounded shadow-lg',
                            'bg-black border border-gray-200',
                            'dark:bg-neutral-800 dark:border-neutral-700',
                            'max-w-md'
                        )}
                    >
                        <header className="relative px-6 py-5 text-lg text-red-600 font-bold">
                            {title}
                        </header>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={cx(
                                'absolute text-sm cursor-base text-gray-600 dark:text-gray-400 hover:text-primary-500 top-4 right-4'
                            )}
                        >
                            X
                        </button>
                        <div className="flex-1 px-6 py-2">
                            <p className="text-base font-medium text-red-500 ">
                                {message}
                            </p>
                        </div>
                        <footer className="px-6 py-4">
                            <Button
                                ref={completeButtonRef}
                                variant="light"
                                color="primary"
                                onClick={handleClose}
                            >
                                {buttonText}
                            </Button>
                        </footer>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};

export default Popup;
