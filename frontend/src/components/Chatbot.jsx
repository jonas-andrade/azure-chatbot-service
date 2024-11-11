import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import mrRobotImage from '../assets/Mr-robot.png';

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (userMessage.trim() === '') return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, from: 'user' }
    ]);
    setUserMessage('');
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/chat', {
        message: userMessage,
      }, { headers: { "Content-Type": "application/json" } });

      const botResponse = response.data.message;
      const currentRole = response.data.roleResponse; // Pega o 'roleResponse' da resposta do backend

      // Verificando a resposta do backend
      console.log('Backend response:', response.data); // Para debug

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, from: currentRole || 'elliot' } // Atribui 'elliot' como fallback
      ]);
    } catch (error) {
      console.error(error);
      setError('Erro ao se comunicar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="azure-icon">
      </div>
      <div className="chatbot-container">
        <div className="chat-header">
          <img src={mrRobotImage} alt="Mr. Robot" className="mr-robot-image" />
        </div>
        <div className="view-messages">
          {messages.map((msg, index) => {
            console.log('Message from:', msg.from); // Verifique o valor de msg.from no console
            return (
              <div 
                key={index} 
                className={`message ${msg.from === 'user' ? 'user' : msg.from === 'Mr. Robot' ? 'mr-robot' : 'elliot'}`}
              >
                {msg.text}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {error && <div className="message-error">{error}</div>}
        {loading && <div className="loading">Carregando...</div>}
        <form className="input_and_btn" onSubmit={sendMessage}>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button type="submit" disabled={loading}>Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
