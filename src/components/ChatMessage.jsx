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

  const messageClasses = message.sender === 'user'
    ? 'bg-blue-500 text-white self-end rounded-bl-lg rounded-tr-lg rounded-tl-lg'
    : 'bg-gray-200 text-gray-800 self-start dark:bg-gray-700 dark:text-gray-200 rounded-br-lg rounded-tr-lg rounded-tl-lg';

  return (
    <div
      className={`flex flex-col max-w-[85%] p-3 rounded-lg shadow-sm relative ${messageClasses}`}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      <p className="whitespace-pre-wrap">{message.text}</p>
      {message.imageUrl && (
        <img
          src={message.imageUrl}
          alt="Uploaded"
          className="mt-2 rounded-md max-w-full h-auto object-cover border border-gray-300 dark:border-gray-600"
          style={{ maxHeight: '200px' }}
        />
      )}
      <span className="text-xs mt-1 text-right opacity-80">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      {showCopy && message.sender === 'ai' && ( // Only show for AI messages
        <button
          onClick={handleCopy}
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