import { useState, useRef, useEffect } from 'react';
import { showToast } from '../../lib/toast';

export const ChatInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [message]);

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast('error', 'Image size too large! Max 5MB.');
                event.target.value = null;
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                showToast('info', 'Image attached, click send!');
            };
            reader.onerror = () => {
                showToast('error', 'Failed to read image.');
                setImagePreview(null);
                event.target.value = null;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() || imagePreview) {
            onSendMessage(message.trim(), imagePreview);
            setMessage('');
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        } else {
            showToast('error', 'Message cannot be empty!');
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-end space-x-3 shadow-lg">
            {imagePreview && (
                <div className="relative p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition duration-200"
                        aria-label="Remove image"
                    >
                        &times;
                    </button>
                </div>
            )}
            <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                    }
                }}
                placeholder="Message Gemini..."
                rows={1}
                className="flex-1 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white custom-scrollbar transition duration-200 overflow-y-auto"
                style={{ maxHeight: '70px' }}
            />
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload-input"
            />
            <label htmlFor="image-upload-input" className="p-3 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-600 transition duration-200" aria-label="Upload image">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 4 4 4-4zM9.5 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
                </svg>
            </label>
            <button
                type="submit"
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                disabled={!message.trim() && !imagePreview}
                aria-label="Send message"
            >
                <svg className="w-7 h-7 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l4.47-1.49a1 1 0 00.864-.864l1.49-4.47a1 1 0 00-.095-.919 1 1 0 00-.81-.439H8.473L7.35 15.362a.5.5 0 01-.894-.447l4.5-9a.5.5 0 01.894 0l4.5 9a.5.5 0 01-.894.447L11.527 8.638H9.932a1 1 0 00-.81.439 1 1 0 00-.095.919l1.49 4.47a1 1 0 00.864.864l4.47 1.49a1 1 0 001.169-1.409l-7-14z" />
                </svg>
            </button>
        </form>
    );
};
