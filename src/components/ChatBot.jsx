import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "../styles/chatbot.css";

const suggestions = [
  'what are symptoms of diabetes?',
  'how to treat fever?',
  'what is normal oxygen level?',
  'can i take paracetamol and ibuprofen together?',
  'what is the dosage of amoxicillin?',
];

const ChatBot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const simulateBotTyping = (fullMessage, prevHistory) => {
    const words = fullMessage.replace(/\n\n/g, '\n').split(' ');
    let currentText = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? '' : ' ') + words[index];
        setChatHistory([...prevHistory, { role: 'assistant', content: currentText }]);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 80); // faster typing for better UX
  };

  const handleSend = async () => {
    if (!userInput.trim() || isTyping) return;

    const newHistory = [...chatHistory, { role: 'user', content: userInput }];
    setChatHistory(newHistory);
    setUserInput('');
    setIsTyping(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/chatbot', {
        message: userInput,
      });

      const botMessage = response.data.response || "Sorry, I didn't get that.";
      simulateBotTyping(botMessage, newHistory);
    } catch (err) {
      console.error('Frontend Error:', err.message);
      setError('❌ Sorry, I am having trouble connecting to the medical brain 🧠');
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    setListening(true);
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      alert('🎤 Could not capture voice. Try again.');
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    setUserInput(text);
    setTimeout(handleSend, 100);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className={`message ${msg.role}`}>
              {msg.content.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="message bot">
              typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask something medical..."
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={isTyping}>Send</button>
        <button onClick={handleVoiceInput}>
          {listening ? '🎤...' : '🎤'}
        </button>
      </div>

      <div className="suggestions">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="suggestion-btn"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default ChatBot;
