'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: '¡Hola! Soy un asistente RAG (Retrieval-Augmented Generation). Puedo responder preguntas sobre el contenido indexado. ¿Qué deseas saber?',
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || loading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setLoading(true);

      try {
        const response = await fetch('/api/rag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.content || 'No pude generar una respuesta.',
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Hubo un error al procesar tu pregunta. Intenta nuevamente.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '900px',
      margin: '0 auto',
      background: 'white',
      boxShadow: '0 0 20px rgba(0,0,0,0.2)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '5px' }}>🤖 RAG Chatbot</h1>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>Sistema de Retrieval-Augmented Generation</p>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {messages.map((message) => (
          <div key={message.id} style={{
            display: 'flex',
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              wordWrap: 'break-word',
              lineHeight: '1.5',
              fontSize: '14px',
              background: message.role === 'user' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : '#f0f0f0',
              color: message.role === 'user' ? 'white' : '#333'
            }}>
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '15px 20px',
              borderRadius: '18px 18px 18px 4px',
              background: '#f0f0f0'
            }}>
              Escribiendo...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{
        padding: '15px 20px',
        background: '#f9f9f9',
        borderTop: '1px solid #e0e0e0'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #d0d0d0',
              borderRadius: '24px',
              fontSize: '14px',
              outline: 'none',
              background: loading ? '#f0f0f0' : 'white'
            }}
          />
          <button type="submit" disabled={loading} style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '18px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}>
            {loading ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  );
}
