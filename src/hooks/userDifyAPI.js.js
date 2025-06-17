import { useState } from 'react';

const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;
const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL;

// Função para gerar um ID único para conversas e usuários
const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// A mensagem inicial padrão para novas conversas
const initialMessage = { 
  text: "Olá! Sou o assistente da Spin Engenharia. Como posso ajudar a solucionar suas dúvidas sobre o Action.net?", 
  sender: "bot" 
};

export const useDifyAPI = () => {
  // Agora gerenciamos uma lista de conversas
  const [conversations, setConversations] = useState([
    { id: generateId('conv'), name: 'Nova Conversa', messages: [initialMessage], difyConversationId: null }
  ]);
  
  // E controlamos qual conversa está ativa
  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => generateId('user'));

  // Função para mudar a conversa ativa
  const switchConversation = (id) => {
    setActiveConversationId(id);
  };

  // Função para criar uma nova conversa
  const startNewConversation = () => {
    const newId = generateId('conv');
    const newConversation = {
      id: newId,
      name: `Conversa #${conversations.length + 1}`,
      messages: [initialMessage],
      difyConversationId: null
    };
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newId);
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const activeConvIndex = conversations.findIndex(c => c.id === activeConversationId);
    if (activeConvIndex === -1) return;

    const currentDifyConvId = conversations[activeConvIndex].difyConversationId;

    // Atualiza a UI imediatamente com a mensagem do usuário
    const updatedConversations = [...conversations];
    updatedConversations[activeConvIndex].messages.push({ text: userMessage, sender: "user" });
    setConversations(updatedConversations);
    setIsLoading(true);

    const requestBody = {
      inputs: {},
      query: userMessage,
      user: userId,
      response_mode: "streaming",
      conversation_id: currentDifyConvId,
    };

    try {
      const response = await fetch(DIFY_API_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${DIFY_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = "";
      let finalDifyConvId = currentDifyConvId;

      // Adiciona um placeholder para a resposta do bot
      const convsWithPlaceholder = [...updatedConversations];
      convsWithPlaceholder[activeConvIndex].messages.push({ text: "", sender: "bot" });
      setConversations(convsWithPlaceholder);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
            const jsonStr = line.replace('data: ', '');
            try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.event === "agent_message" || parsed.event === "message") {
                   botResponse += parsed.answer;
                   setConversations(prev => {
                       const newConvs = [...prev];
                       const activeIdx = newConvs.findIndex(c => c.id === activeConversationId);
                       const lastMessageIdx = newConvs[activeIdx].messages.length - 1;
                       newConvs[activeIdx].messages[lastMessageIdx].text = botResponse;
                       return newConvs;
                   });
                }
                if (parsed.conversation_id) {
                    finalDifyConvId = parsed.conversation_id;
                }
            } catch (e) { /* Ignora erros de parsing */ }
        }
      }
      
      // Salva o ID da conversa do Dify para continuidade
      if (finalDifyConvId) {
        setConversations(prev => {
          const finalConvs = [...prev];
          finalConvs[activeConvIndex].difyConversationId = finalDifyConvId;
          return finalConvs;
        });
      }

    } catch (error) {
      console.error("Erro ao contatar a API do Dify:", error);
       setConversations(prev => {
          const errorConvs = [...prev];
          errorConvs[activeConvIndex].messages.push({ text: "Desculpe, não consegui me conectar ao sistema.", sender: "bot" });
          return errorConvs;
        });
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    conversations, 
    activeConversationId, 
    isLoading, 
    sendMessage, 
    switchConversation, 
    startNewConversation 
  };
};