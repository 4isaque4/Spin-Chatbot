import { useState } from 'react';

const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;
const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL;

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
const initialMessage = { text: "Olá! Sou o assistente da Spin Engenharia. Como posso ajudar a solucionar suas dúvidas sobre o Action.net?", sender: "bot" };
const createNewConversation = () => ({
  id: generateId('conv'),
  name: 'Nova Conversa',
  messages: [initialMessage],
  difyConversationId: null
});

export const useDifyAPI = () => {
  const [conversations, setConversations] = useState([createNewConversation()]);
  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => generateId('user'));

  const switchConversation = (id) => setActiveConversationId(id);

  const startNewConversation = () => {
    const newConversation = createNewConversation();
    // Renomeia para diferenciar se já houver uma "Nova Conversa"
    const existingNames = conversations.map(c => c.name);
    let newName = newConversation.name;
    let counter = 2;
    while (existingNames.includes(newName)) {
        newName = `Nova Conversa ${counter}`;
        counter++;
    }
    newConversation.name = newName;

    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newConversation.id);
  };

  // NOVA FUNÇÃO: Renomear conversa
  const renameConversation = (id, newName) => {
    if (!newName.trim()) return;
    setConversations(prev => 
      prev.map(c => (c.id === id ? { ...c, name: newName.trim() } : c))
    );
  };

  // NOVA FUNÇÃO: Deletar conversa
  const deleteConversation = (idToDelete) => {
    setConversations(prev => {
      const remaining = prev.filter(c => c.id !== idToDelete);
      
      if (remaining.length === 0) {
        const newConv = createNewConversation();
        setActiveConversationId(newConv.id);
        return [newConv];
      }
      
      if (activeConversationId === idToDelete) {
        setActiveConversationId(remaining[0].id);
      }
      
      return remaining;
    });
  };

  const sendMessage = async (userMessage) => {
    // ... (O restante da função sendMessage continua exatamente o mesmo de antes)
    if (!userMessage.trim()) return;
    const activeConvIndex = conversations.findIndex(c => c.id === activeConversationId);
    if (activeConvIndex === -1) return;
    const currentDifyConvId = conversations[activeConvIndex].difyConversationId;
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
                       if(activeIdx === -1) return newConvs;
                       const lastMessageIdx = newConvs[activeIdx].messages.length - 1;
                       newConvs[activeIdx].messages[lastMessageIdx].text = botResponse;
                       return newConvs;
                   });
                }
                if (parsed.conversation_id) {
                    finalDifyConvId = parsed.conversation_id;
                }
            } catch (e) { /* Ignora erros */ }
        }
      }
      if (finalDifyConvId) {
        setConversations(prev => {
          const finalConvs = [...prev];
          const activeIdx = finalConvs.findIndex(c => c.id === activeConversationId);
          if(activeIdx !== -1) finalConvs[activeIdx].difyConversationId = finalDifyConvId;
          return finalConvs;
        });
      }
    } catch (error) {
      console.error("Erro ao contatar a API do Dify:", error);
       setConversations(prev => {
          const errorConvs = [...prev];
          const activeIdx = errorConvs.findIndex(c => c.id === activeConversationId);
          if(activeIdx !== -1) errorConvs[activeIdx].messages.push({ text: "Desculpe, não consegui me conectar ao sistema.", sender: "bot" });
          return errorConvs;
        });
    } finally {
      setIsLoading(false);
    }
  };

  // Exporta as novas funções
  return { 
    conversations, 
    activeConversationId, 
    isLoading, 
    sendMessage, 
    switchConversation, 
    startNewConversation,
    renameConversation,
    deleteConversation
  };
};