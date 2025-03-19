'use client'
import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }: any) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-300 flex items-center bg-white w-full">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-600 text-white p-2 rounded-r-lg"
      >
        Gửi
      </button>
    </div>
  );
};

export default MessageInput;