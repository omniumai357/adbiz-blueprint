
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Constants
const MODEL_NAME = "deepseek-ai/deepseek-coder-6.7b-instruct"; // Using the 6.7B parameter model
const SYSTEM_PROMPT = `You are a helpful customer support agent for adbiz.pro, a digital marketing company specializing in Craigslist posting and marketing services for service businesses. 
Answer questions concisely and professionally. If you don't know an answer, offer to connect the customer with a human agent.

Company Services:
- Craigslist ad posting services ($129-$499/month)
- Custom SEO-Ad creation ($149-$299 per ad)
- Platinum Package ($999 for 12-month campaign with second language included)
- Social media management
- Website design for service businesses

Common Support Topics:
- Package pricing and features
- Custom ad creation process
- Refund policy: 14-day satisfaction guarantee
- Ad posting timeline: 24-48 hours after approval
- File uploads: Supports images, videos, and documents under 100MB`;

const CustomerSupportChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm the adbiz.pro support assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration for your Deepseek deployment
  // Using import.meta.env which is the Vite way to access environment variables
  const apiConfig = {
    // For self-hosted deployment
    baseUrl: import.meta.env.VITE_AI_API_URL || 'http://localhost:8000',
    // For cloud provider deployment
    // apiKey: import.meta.env.VITE_API_KEY,
    maxTokens: 500,
    temperature: 0.7,
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate response from AI model
  const generateResponse = async (userMessage: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add user's new message
      conversationHistory.push({
        role: 'user',
        content: userMessage
      });
      
      // Make API request
      const response = await axios.post(`${apiConfig.baseUrl}/v1/chat/completions`, {
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory
        ],
        max_tokens: apiConfig.maxTokens,
        temperature: apiConfig.temperature,
      });
      
      // Extract the response
      const aiResponse = response.data.choices[0].message.content;
      
      // Update messages with AI response
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (err) {
      console.error('Error generating response:', err);
      setError('Sorry, I encountered an error. Please try again or contact our support team directly.');
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again or contact our support team at support@adbiz.pro for immediate assistance."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [
      ...prev,
      { role: 'user', content: input }
    ]);
    
    const userMessage = input;
    setInput(''); // Clear input field
    
    // Generate AI response
    await generateResponse(userMessage);
  };

  // Handle connecting to a human agent
  const handleConnectToHuman = () => {
    setMessages(prev => [
      ...prev,
      { 
        role: 'assistant', 
        content: "I'll connect you with a human support agent. Please provide your email address, and a support agent will contact you within 24 hours."
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-300 shadow-lg">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-xl font-bold">adbiz.pro Support</div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={handleConnectToHuman}
            className="bg-white text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-100"
          >
            Talk to Human
          </button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-gray-300 rounded-tl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-300 rounded-lg rounded-tl-none px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="bg-white border-t border-gray-300 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerSupportChatbot;
