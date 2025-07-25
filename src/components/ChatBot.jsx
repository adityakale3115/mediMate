import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', content: userInput }];
    setChatHistory(newHistory);
    setIsTyping(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/chatbot', {
        message: userInput,
      });

      const botMessage = response.data.response;
      setChatHistory([...newHistory, { role: 'assistant', content: botMessage }]);
    } catch (err) {
      console.error('Frontend Error:', err.message);
      setError('sorry, i am having trouble connecting to the medical brain 🧠');
    } finally {
      setIsTyping(false);
    }

    setUserInput('');
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('speech recognition not supported in this browser.');
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
      alert('could not capture voice. try again.');
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    setUserInput(text);
    setTimeout(handleSend, 100); // wait for state to update before sending
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: 'auto',
      background: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>💬 MediBot Assistant</h2>

      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '10px',
        background: '#fff',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #ccc'
      }}>
        {chatHistory.map((msg, idx) => (
          <p key={idx} style={{ margin: '5px 0' }}>
            <strong style={{ color: msg.role === 'user' ? '#333' : '#007bff' }}>
              {msg.role === 'user' ? 'you' : 'medibot'}:
            </strong> {msg.content}
          </p>
        ))}
        {isTyping && (
          <p><strong>medibot:</strong> typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></p>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ask something medical..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <button onClick={handleSend} style={{ padding: '10px 15px' }}>send</button>
        <button onClick={handleVoiceInput} style={{ padding: '10px 15px' }}>
          {listening ? '🎤...' : '🎤'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            style={{
              padding: '8px 12px',
              borderRadius: '20px',
              border: '1px solid #000000ff',
              background: '#000000ff',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChatBot;
