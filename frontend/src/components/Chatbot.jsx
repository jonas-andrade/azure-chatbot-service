import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import mrRobotImage from '../assets/Mr-robot.png';

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
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

    try {
      const response = await axios.post('http://localhost:3000/chat', {
        message: userMessage,
      }, { headers: { "Content-Type": "application/json" } });

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
    <div className="chatbot-wrapper">
      <div className="azure-icon">
      </div>
      <div className="chatbot-container">
        <div className="chat-header">
          <img src={mrRobotImage} alt="Mr. Robot" className="mr-robot-image" />
        </div>
        <div className="view-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.from}-message`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {error && <div className="message-error">{error}</div>}
        <form className="input_and_btn" onSubmit={sendMessage}>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
