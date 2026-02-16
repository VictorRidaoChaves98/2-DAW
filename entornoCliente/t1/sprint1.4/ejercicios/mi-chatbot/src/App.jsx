import React from "react";
import "./styles/layout.css";
import "./App.css";  // ✅ sin la carpeta styles
import ChatWindow from "./components/Chatbot/ChatWindow.jsx";


function App() {
  return (
    <div className="app">
      {/* Presentación del chatbot */}
      <div className="chatbot-header">
        <img
          src="/assets/shodan/shodan.gif"
          alt="SHODAN"
          className="chatbot-avatar"
        />
        <h1>S.H.O.D.A.N.</h1>
        <p className="slogan">
          Tu confiable asistente personal para ayudarte en todo lo que necesites
        </p>
      </div>

      {/* Zona del chatbot */}
      <ChatWindow />
    </div>
  )
}

export default App
