import { useState } from 'react';

const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;
const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL;

export const useDifyAPI = () => {
  const [messages, setMessages] = useState([
    { text: "Olá! Sou o assistente da Spin Engenharia. Como posso ajudar a solucionar suas dúvidas sobre o Action.net?", sender: "bot" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [userId] = useState(() => 'user_' + Math.random().toString(36).substr(2, 9));
  const [conversationId, setConversationId] = useState(null);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setIsLoading(true);

    const requestBody = {
      inputs: {}, // Campo obrigatório que estava faltando
      query: userMessage,
      user: userId,
      response_mode: "streaming",
    };

    if (conversationId) {
      requestBody.conversation_id = conversationId;
    }

    try {
      const response = await fetch(DIFY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = "";
      
      setMessages(prev => [...prev, { text: "", sender: "bot" }]);

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
                   setMessages(prev => {
                       const newMessages = [...prev];
                       newMessages[newMessages.length - 1].text = botResponse;
                       return newMessages;
                   });
                }
                if (parsed.conversation_id) {
                    setConversationId(parsed.conversation_id);
                }
            } catch (e) {
                // Ignora erros
            }
        }
      }

    } catch (error) {
      console.error("Erro ao contatar a API do Dify:", error);
      setMessages(prev => [...prev, { text: "Desculpe, não consegui me conectar ao sistema. Tente novamente mais tarde.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};