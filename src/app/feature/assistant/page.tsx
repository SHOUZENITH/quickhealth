'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your QuickHealth Assistant. I can help explain symptoms, medication information, or general wellness advice. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();
      
      if (data.choices && data.choices[0]) {
        const aiMessage = { role: 'assistant' as const, content: data.choices[0].message.content };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('No response from AI');
      }

    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050b14] text-gray-900 dark:text-white font-sans flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050b14]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-500" />
                Health Assistant
              </h1>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* --- DISCLAIMER BANNER --- */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-200 dark:border-yellow-500/20 px-4 py-2 text-center">
        <p className="text-xs text-yellow-800 dark:text-yellow-500 flex items-center justify-center gap-2">
          <AlertTriangle className="w-3 h-3" />
          AI can make mistakes. Always consult a real doctor for medical decisions.
        </p>
      </div>

      {/* --- CHAT AREA --- */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-y-auto">
        <div className="space-y-6 pb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* AI Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-tl-sm shadow-sm'
              }`}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">{line}</p>
                ))}
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex-shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs text-gray-400">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* --- INPUT AREA --- */}
      <div className="sticky bottom-0 bg-white dark:bg-[#050b14] border-t border-gray-200 dark:border-white/10 p-4">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about symptoms, drugs, or nutrition..." 
              className="w-full pl-6 pr-14 py-4 rounded-full bg-gray-100 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#0f172a] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-lg"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-2">
            QuickHealth AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

    </div>
  );
}