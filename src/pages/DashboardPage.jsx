import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../lib/toast';
import { SearchBar } from '../components/common/SearchBar';
import { Link } from 'react-router-dom';
import { DarkModeToggle } from '../components/common/DarkModeToggle';
import { DeleteConfirmationModal } from '../components/common/DeleteConfirmationModal';

export const DashboardPage = () => {
    const { chatrooms, createChatroom, deleteChatroom, setActiveChatroomId } = useChat();
    const { logout } = useAuth();
    const [newChatroomTitle, setNewChatroomTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [chatroomToDelete, setChatroomToDelete] = useState(null);

    const handleCreateChatroom = (e) => {
        e.preventDefault();
        if (newChatroomTitle.trim()) {
            const newRoom = createChatroom(newChatroomTitle.trim());
            showToast('success', `Chatroom '${newChatroomTitle}' created!`);
            setNewChatroomTitle('');
        } else {
            showToast('error', 'Chatroom title cannot be empty.');
        }
    };

    const handleDeleteChatroom = (id, title) => {
        if (window.confirm(`Are you sure you want to delete '${title}'?`)) {
            deleteChatroom(id);
            showToast('success', `Chatroom '${title}' deleted.`);
        }
    };

    const handleChatroomClick = (id) => {
        setActiveChatroomId(id);
    };

    const filteredChatrooms = chatrooms.filter(room =>
        room.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openDeleteModal = (room) => {
        setChatroomToDelete(room);
        setModalOpen(true);
    };

    const confirmDelete = () => {
        deleteChatroom(chatroomToDelete.id);
        showToast('success', `Chatroom '${chatroomToDelete.title}' deleted.`);
        setModalOpen(false);
    };

    const cancelDelete = () => {
        setModalOpen(false);
        setChatroomToDelete(null);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <header className="p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Chatbot</h1>
                <div className="flex items-center space-x-4">
                    <DarkModeToggle />
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <h2 className="text-2xl font-bold mb-6">Your Chatrooms</h2>

                <form onSubmit={handleCreateChatroom} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        value={newChatroomTitle}
                        onChange={(e) => setNewChatroomTitle(e.target.value)}
                        placeholder="Enter new chatroom title"
                        className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-200"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 w-full sm:w-auto"
                    >
                        Create Chatroom
                    </button>
                </form>

                <SearchBar onSearch={setSearchQuery} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredChatrooms.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500 text-lg mt-8">No chatrooms found. Create one to get started!</p>
                    ) : (
                        filteredChatrooms.map((room) => (
                            <div key={room.id} className="relative p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition duration-200 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                                <Link to={`/chat/${room.id}`} onClick={() => handleChatroomClick(room.id)} className="block">
                                    <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2 truncate">
                                        {room.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Created: {new Date(room.createdAt).toLocaleDateString()}
                                    </p>
                                </Link>
                                <button
                                    onClick={() => openDeleteModal(room)}
                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition duration-200"
                                    aria-label={`Delete chatroom ${room.title}`}
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <DeleteConfirmationModal
                isOpen={modalOpen}
                title={chatroomToDelete?.title || ''}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};
