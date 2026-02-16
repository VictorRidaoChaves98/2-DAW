import React, { useState } from 'react';

function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="message-input">
            <input
                type="text"
                placeholder="Escribe el nombre o número de un Pokémon..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Enviar</button>
        </div>
    );
}

export default MessageInput;
