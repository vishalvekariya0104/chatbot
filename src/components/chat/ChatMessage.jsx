export const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[49%] break-words rounded-lg p-3 shadow-md ${isUser ? 'bg-blue-600 text-white text-left' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-left'}`}
      >
        {message.text && (
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.text}
          </p>
        )}

        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="attachment"
            className="mt-2 rounded-md max-w-full max-h-60 object-contain"
          />
        )}
        <p className="text-xs dark:text-gray-300 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
      </div>
    </div>
  );
};
