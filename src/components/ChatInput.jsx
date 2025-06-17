import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Digite sua dúvida sobre o Action.net..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {/* Aqui você pode usar um ícone SVG de envio */}
        ➢
      </button>
    </form>
  );
};

export default ChatInput;