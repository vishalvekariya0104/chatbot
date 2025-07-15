import React, { useState } from 'react';
import { showToast } from '../../lib/toast';

export const ChatMessage = ({ message }) => {
  const [showCopy, setShowCopy] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      showToast('success', 'Message copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy message: ', err);
      showToast('error', 'Failed to copy message.');
    }
  };

  const isUser = message.sender === 'user';

  return (
    <div
      className={`group relative max-w-[49%] px-4 py-2 rounded-lg shadow-sm text-sm whitespace-pre-wrap break-words mt-10 ${isUser
        ? 'self-end bg-blue-100 dark:bg-blue-600 text-left text-gray-900 dark:text-white'
        : 'self-start bg-gray-100 dark:bg-gray-700 text-left text-gray-800 dark:text-white'
        }`}
      onMouseEnter={() => setShowCopy(true)}
    >
      {message.imageUrl && (
        <img
          src={message.imageUrl}
          alt="sent"
          className="mb-2 rounded-md max-w-xs max-h-48 object-cover"
          style={{width: '100%'}}
        />
      )}
      {message.text}
      {showCopy && message.sender === 'ai' && (
        <button
          onMouseEnter={handleCopy}
          className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1.5 text-xs hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 shadow-md transition duration-200"
          aria-label="Copy message"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        </button>
      )}
    </div>
  );
};
