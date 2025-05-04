import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

  async function analyzeSentiment(message) {
    const endpoint = "https://mentalhealthai.cognitiveservices.azure.com//text/analytics/v3.1/sentiment";
    const apiKey = "GCwwZPIsLDuu5uE2AMBxLHcGVimqPDBo6RD2z5SEaAK6RjKojTEIJQQJ99BEACYeBjFXJ3w3AAAEACOGyDpL"; // Replace with secure backend call

  
    const headers = {
      "Ocp-Apim-Subscription-Key": apiKey,
      "Content-Type": "application/json"
    };
  
    const data = {
      documents: [
        {
          id: "1",
          language: "en",
          text: message
        }
      ]
    };
  
    const response = await axios.post(endpoint, data, { headers });
    const sentimentData = response.data.documents[0];
    return {
      sentiment: sentimentData.sentiment,
      confidenceScores: sentimentData.confidenceScores
    };
  }
  
  function getAIResponse({ sentiment, confidenceScores }, message, context, stageSetter) {
    const msg = message.toLowerCase();
  
    if (msg === "no") {
      return "That's okay. I'm here whenever you're ready to talk. Take your time. 💙";
    }
  
    if (msg.includes("give up")) {
      stageSetter("support");
      return "I'm really sorry you're feeling this way. One exam doesn't define your future. You've already shown strength by reaching out. Would you like some support or a plan to move forward?";
    }
  
    if (msg.includes("what can i do")) {
      stageSetter("plan");
      return "It’s great that you’re asking. You could review what went wrong, talk to a tutor, or take a short break to reset. Want help making a plan?";
    }
  
    if (msg.includes("yes") && context.lastUserMessage.includes("plan")) {
      stageSetter("action");
      return "Great! Let’s start by identifying what topics were most challenging. Do you remember which sections you struggled with most?";
    }
  
    if (sentiment === "positive" && confidenceScores.positive > 0.8) {
      return "That's wonderful to hear! What made you feel this way?";
    }
  
    if (sentiment === "negative") {
      if (msg.includes("fail") || msg.includes("exam")) {
        stageSetter("explore");
        return "I'm really sorry to hear that. Failing an exam can be tough, but it's not the end. Want to talk about what happened?";
      } else if (msg.includes("alone") || msg.includes("sad")) {
        return "It sounds like you're feeling down. You're not alone—I'm here for you. 💙";
      }
      return "It sounds like you're going through something difficult. I'm here for you—want to share more?";
    }
  
    if (sentiment === "neutral") {
      return "I'm listening. Feel free to share whatever's on your mind.";
    }
  
    return "Thanks for sharing. Would you like to talk more about it?";
  }
  
  function App() {
    const [messages, setMessages] = useState([
      { sender: 'bot', text: 'Hello! How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [context, setContext] = useState({
      lastUserMessage: '',
      lastSentiment: ''
    });
    const [conversationStage, setConversationStage] = useState("support");
    const messagesEndRef = useRef(null);
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
    const handleSend = async () => {
      if (!input.trim()) return;
  
      const userMessage = { sender: 'user', text: input.trim() };
      setMessages(prev => [...prev, userMessage]);
      const messageText = input.trim();
      setInput('');
  
      // Show typing indicator
      setMessages(prev => [...prev, { sender: 'bot', text: 'Typing...' }]);
  
      try {
        const sentimentResult = await analyzeSentiment(messageText);
  
        // Update context
        setContext({
          lastUserMessage: messageText,
          lastSentiment: sentimentResult.sentiment
        });
  
        const botText = getAIResponse(sentimentResult, messageText, context, setConversationStage);
  
        // Replace typing indicator with actual response
        setMessages(prev => [
          ...prev.slice(0, -1),
          { sender: 'bot', text: botText }
        ]);
      } catch (error) {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { sender: 'bot', text: "Sorry, I had trouble analyzing that. Can you try again?" }
        ]);
      }
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    };
  
    return (
      <div className="app-container">
        <h1 className="app-title">EchoCare</h1>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-box"
          />
          <button onClick={handleSend} className="send-button">Send</button>
        </div>
      </div>
    );
  }
  
  export default App;
  