import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { ImWarning } from 'react-icons/im';
import { useSelector } from 'react-redux';

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    message,
    confirmLabel = "Yes, I'm sure",
    cancelLabel = 'No, cancel',
    isLoading = false,
}) => {
    const { theme } = useSelector((state) => state.themeSliceApp);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`relative z-[101] flex w-80 md:w-96 flex-col items-center gap-7 rounded-md px-3 py-5 shadow-lg ${theme === 'dark' ? 'bg-zinc-800 text-gray-200' : 'bg-white text-gray-900'}`}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="place-self-end transition-all"
                    onClick={onClose}
                    aria-label="Close dialog"
                >
                    <IoClose size={25} />
                </button>

                <ImWarning size={40} />

                <p className="text-base text-center">{message}</p>

                <div className="flex gap-4">
                    <button
                        type="button"
                        disabled={isLoading}
                        className={`rounded-md px-2 py-2 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 ${theme === 'dark' ? 'bg-red-700 active:bg-red-800' : 'bg-red-400 active:bg-red-500'}`}
                        onClick={onConfirm}
                    >
                        {isLoading ? 'Please wait...' : confirmLabel}
                    </button>

                    <button
                        type="button"
                        disabled={isLoading}
                        className="rounded-md border bg-transparent px-3 py-2 text-sm font-semibold transition-all active:scale-95 active:bg-gray-600 disabled:opacity-50"
                        onClick={onClose}
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
