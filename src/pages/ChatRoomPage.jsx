// src/pages/ChatroomPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { useThrottle } from '../hooks/useThrottle';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { showToast, dismissToast } from '../lib/toast';

export const ChatroomPage = () => {
    const { id: chatroomId } = useParams();
    const navigate = useNavigate();
    const { getMessagesForChatroom, addMessageToChatroom, setActiveChatroomId, chatrooms } = useChat();

    const [isGeminiTyping, setIsGeminiTyping] = useState(false);
    const [displayedMessages, setDisplayedMessages] = useState([]);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentOffset, setCurrentOffset] = useState(0);
    const messagesPerPage = 20;

    const scrollRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        setActiveChatroomId(chatroomId);
        const roomExists = chatrooms.some(room => room.id === chatroomId);
        if (!roomExists) {
            showToast('error', 'Chatroom not found!');
            navigate('/dashboard');
            return;
        }

        const allMessagesForRoom = getMessagesForChatroom(chatroomId);
        const initialMessages = allMessagesForRoom.slice(-messagesPerPage);
        setDisplayedMessages(initialMessages);
        setCurrentOffset(allMessagesForRoom.length - initialMessages.length);
        setHasMore(allMessagesForRoom.length > messagesPerPage);

        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        const timeout = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [chatroomId, getMessagesForChatroom, setActiveChatroomId, chatrooms, navigate, messagesPerPage]);


    const loadOlderMessages = useCallback(() => {
        if (loadingOlder || !hasMore) return;

        setLoadingOlder(true);
        const toastId = showToast('loading', 'Loading older messages...');

        setTimeout(() => {
            const allMessagesForRoom = getMessagesForChatroom(chatroomId);
            const startIndex = Math.max(0, currentOffset - messagesPerPage);
            const endIndex = currentOffset;
            const older = allMessagesForRoom.slice(startIndex, endIndex);

            if (older.length > 0) {
                setDisplayedMessages(prev => [...older, ...prev]);
                setCurrentOffset(startIndex);
                setHasMore(startIndex > 0);
            } else {
                setHasMore(false);
            }
            setLoadingOlder(false);
            dismissToast(toastId);
            showToast('info', 'Older messages loaded.');
        }, 800);
    }, [loadingOlder, hasMore, currentOffset, messagesPerPage, chatroomId, getMessagesForChatroom]);


    useEffect(() => {
        if (scrollRef.current && !isUserScrolling) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [displayedMessages, isUserScrolling]);

    useEffect(() => {
        if (scrollRef.current && loadingOlder) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeightRef.current;
        }
        prevScrollHeightRef.current = scrollRef.current?.scrollHeight || 0;
    }, [loadingOlder, displayedMessages]);

    const observer = useRef(null);
    const topRef = useCallback((node) => {
        if (loadingOlder) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                prevScrollHeightRef.current = scrollRef.current?.scrollHeight || 0;
                loadOlderMessages();
            }
        }, {
            root: scrollRef.current,
            threshold: 0.1,
        });

        if (node) observer.current.observe(node);
    }, [loadingOlder, hasMore, loadOlderMessages]);


    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollTop < 100 && !loadingOlder && hasMore) {
            }
            setIsUserScrolling(scrollHeight - scrollTop > clientHeight + 50);
        }
    };

    const simulateAiResponseThrottled = useThrottle(async (userMessageText) => {
        setIsGeminiTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
        const aiResponse = {
            id: `ai-msg-${Date.now()}`,
            sender: 'ai',
            text: `Okay, I received your message: "${userMessageText}". Here's my simulated reply!`,
            timestamp: Date.now(),
        };
        addMessageToChatroom(chatroomId, aiResponse);
        setIsGeminiTyping(false);
    }, 3000);

    const handleSendMessage = (text, imageUrl) => {
        const userMessage = {
            id: `user-msg-${Date.now()}`,
            sender: 'user',
            text: text.trim(),
            timestamp: Date.now(),
            imageUrl: imageUrl,
        };
        addMessageToChatroom(chatroomId, userMessage);
        showToast('success', 'Message sent!');
        simulateAiResponseThrottled(text);
    };

    const currentChatroom = chatrooms.find(room => room.id === chatroomId);
    if (!currentChatroom) {
        return <div className="text-center text-lg mt-20 dark:text-white">Loading chatroom...</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <header className="p-4 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between sticky top-0 z-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    aria-label="Back to dashboard"
                >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span className="hidden sm:inline">Back</span>
                </button>
                <h1 className="text-xl font-bold truncate max-w-[60%]">{currentChatroom.title}</h1>
                <div className="w-10"></div>
            </header>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col-reverse"
                onScroll={handleScroll}
            >
                {isInitialLoading ? (
                    <div className="space-y-6">
                        <LoadingSkeleton count={5} height="40px" width="49%" />
                        <LoadingSkeleton count={3} height="40px" width="49%" className="ml-auto" />
                    </div>
                ) : (
                    <>
                        {isGeminiTyping && (
                            <div className="p-2 text-gray-500 dark:text-gray-400 text-sm italic self-start mb-2">Gemini is typing...</div>
                        )}
                        {[...displayedMessages].reverse().map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                        {loadingOlder && (
                            <div className="text-center py-2">
                                <LoadingSkeleton count={3} height="20px" className="mb-2 mx-auto" width="80%" />
                            </div>
                        )}
                        {hasMore && (
                            <div ref={topRef} className="text-center text-blue-500 cursor-pointer text-sm py-2 hover:underline">
                                Load older messages
                            </div>
                        )}
                    </>
                )}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};
