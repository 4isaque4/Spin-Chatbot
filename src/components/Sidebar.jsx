// src/components/Sidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import ConfirmationModal from './ConfirmationModal.jsx';

const Sidebar = ({ 
  conversations, 
  activeConversationId, 
  switchConversation, 
  startNewConversation,
  renameConversation,
  deleteConversation,
  onLogout // Nova prop para a função de logout
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleStartEdit = (conv) => {
    setEditingId(conv.id);
    setEditingText(conv.name);
  };

  const handleConfirmEdit = () => {
    if (editingId) {
      renameConversation(editingId, editingText);
      setEditingId(null);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleConfirmEdit();
    } else if (event.key === 'Escape') {
      setEditingId(null);
    }
  };
  
  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
  }

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteConversation(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        message="Tem certeza que deseja deletar esta conversa?"
      />
      <div className="sidebar">
        <div> {/* Div extra para agrupar a parte de cima */}
          <button className="new-chat-button" onClick={startNewConversation}>
            Nova Conversa
          </button>
          <div className="sidebar-title">Conversas</div>
          <ul className="conversation-list">
            {conversations.map(conv => (
              <li
                key={conv.id}
                className={`conversation-item ${conv.id === activeConversationId ? 'active' : ''}`}
                onClick={() => editingId !== conv.id && switchConversation(conv.id)}
              >
                {editingId === conv.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    className="rename-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={handleConfirmEdit}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  <span className="conversation-name">{conv.name}</span>
                )}

                <div className="conversation-actions">
                  <button className="action-icon" onClick={() => handleStartEdit(conv)}>✏️</button>
                  <button className="action-icon" onClick={(e) => handleDeleteClick(e, conv.id)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* --- NOVO BOTÃO DE SAIR --- */}
        <button className="logout-button" onClick={onLogout}>
          Sair
        </button>
        {/* --- FIM DO NOVO BOTÃO --- */}
      </div>
    </>
  );
};

export default Sidebar;