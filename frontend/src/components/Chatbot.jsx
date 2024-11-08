import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css'; 

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null); // Para exibir mensagens de erro

  const sendMessage = async (e) => {
    e.preventDefault();

    if (userMessage.trim() === '') return;

    // Adiciona a mensagem do usuário imediatamente
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, from: 'user' }
    ]);
    setUserMessage(''); // Limpa o campo de input

    try {
      // Envia a mensagem para o backend
      const response = await axios.post('http://localhost:3000/chat', {
        message: userMessage
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Adiciona a resposta do bot após a mensagem ser processada
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.message, from: 'bot' }
      ]);
    } catch (error) {
      console.error(error);
      setError('Erro ao se comunicar com o servidor. Tente novamente.');
    }
  };

  return (
    <div id="chat-container">
      <div id="chat-header">
        Chatbot Azure
      </div>
      <div id="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.from}-message`}>
            {msg.text}
          </div>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
      <form id="input-container" onSubmit={sendMessage}>
        <input
          id="user-input"
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chatbot;
