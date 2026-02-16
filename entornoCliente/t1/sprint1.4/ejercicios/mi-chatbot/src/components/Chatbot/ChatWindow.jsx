// src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react'
import MessageList from './MessageList.jsx'
import MessageInput from './MessageInput.jsx'
import { getPokemonData } from '../../services/pokeapi.js'
import { askLMStudio } from '../../services/lmstudio.js'
import '../../styles/chatbot.css'

function ChatWindow() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Bienvenido, ¿en qué puedo ayudarte?' }
    ])
    const [isThinking, setIsThinking] = useState(false)
    const messageListRef = useRef(null)

    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight
        }
    }

    useEffect(() => scrollToBottom(), [messages])

    const handleSendMessage = async (text) => {
        if (!text.trim()) return

        // Mensaje usuario + "pensando"
        setMessages((prev) => [...prev, { sender: 'user', text }, { sender: 'bot', text: 'Pensando...' }])
        setIsThinking(true)

        try {
            const pokemon = await getPokemonData(text.toLowerCase())

            let botResponse
            if (pokemon) {
                botResponse = `Nombre: ${pokemon.name}\nNúmero: ${pokemon.number}\nTipo: ${pokemon.type}`
            } else {
                // Si no hay Pokémon, consulta la IA local
                botResponse = await askLMStudio(text)
            }

            setMessages((prev) => {
                const updated = [...prev]
                updated.pop() // Quitar "Pensando..."
                if (pokemon?.sprite) updated.push({ sender: 'bot', text: botResponse, image: pokemon.sprite })
                else updated.push({ sender: 'bot', text: botResponse })
                return updated
            })
        } catch (error) {
            setMessages((prev) => {
                const updated = [...prev]
                updated.pop()
                updated.push({ sender: 'bot', text: 'Hubo un error procesando tu mensaje.' })
                return updated
            })
        } finally {
            setIsThinking(false)
        }
    }

    return (
        <div className="chat-window">
            <MessageList messages={messages} ref={messageListRef} />
            <MessageInput onSendMessage={handleSendMessage} disabled={isThinking} />
        </div>
    )
}

export default ChatWindow
