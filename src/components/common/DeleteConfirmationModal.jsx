export const DeleteConfirmationModal = ({ isOpen, title, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Delete Chatroom</h2>
                <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete <strong>{title}</strong>?
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
