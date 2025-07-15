import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chatrooms, setChatrooms] = useLocalStorage('chatrooms', []);
  const [messages, setMessages] = useLocalStorage('messages', {});
  const [activeChatroomId, setActiveChatroomId] = useState(null);

  const createChatroom = useCallback((title) => {
    const newRoom = { id: uuidv4(), title, createdAt: Date.now() };
    setChatrooms((prevRooms) => [...prevRooms, newRoom]);
    setMessages((prevMsgs) => ({ ...prevMsgs, [newRoom.id]: [] })); 
    return newRoom;
  }, [setChatrooms, setMessages]);

  const deleteChatroom = useCallback((id) => {
    setChatrooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
    setMessages((prevMsgs) => {
      const newMsgs = { ...prevMsgs };
      delete newMsgs[id]; 
      return newMsgs;
    });
    if (activeChatroomId === id) {
      setActiveChatroomId(null);
    }
  }, [setChatrooms, setMessages, activeChatroomId]);

  const getMessagesForChatroom = useCallback((id) => {
    return messages[id] || [];
  }, [messages]);

  const addMessageToChatroom = useCallback((chatroomId, newMessage) => {
    setMessages((prevMsgs) => ({
      ...prevMsgs,
      [chatroomId]: [...(prevMsgs[chatroomId] || []), newMessage],
    }));
  }, [setMessages]);

  const value = {
    chatrooms,
    createChatroom,
    deleteChatroom,
    activeChatroomId,
    setActiveChatroomId,
    getMessagesForChatroom,
    addMessageToChatroom,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};