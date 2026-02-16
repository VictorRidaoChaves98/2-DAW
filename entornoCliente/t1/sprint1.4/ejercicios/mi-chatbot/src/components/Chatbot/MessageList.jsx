import React, { forwardRef } from 'react'

const MessageList = forwardRef(({ messages }, ref) => {
    return (
        <div className="message-list" ref={ref}>
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                    {msg.sender === 'bot' && (
                        <img
                            src={msg.image || "/assets/shodan/shodan.gif"}
                            alt="SHODAN Avatar"
                            className="bot-avatar"
                        />
                    )}
                    <p>{msg.text}</p>
                </div>
            ))}
        </div>
    )
})

export default MessageList
