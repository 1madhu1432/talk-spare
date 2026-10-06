import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Smile, Lock } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '../contexts/UserContext';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJIS = ['👋', '👍', '😊', '🙌', '🎉', '💡', '🔥', '❤️', '👏', '🎯'];

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const { chatHistory, sendChatMessage } = useSocket();
  const { profile } = useUser();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChatMessage(text);
    setText('');
  };

  const handleAddEmoji = (emoji: string) => {
    setText((prev) => (prev + emoji).substring(0, 500));
  };

  return (
    <div className="fixed right-0 top-16 bottom-20 z-30 w-full sm:w-80 glass-panel border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Temporary Room Chat</h3>
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            Not saved. Clears on room exit.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Smile className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs text-slate-400 font-medium">No messages yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">Say hello to start the conversation!</p>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isMe = msg.senderNickname === profile.nickname;
            return (
              <div
                key={msg.id}
                className={`flex gap-2 text-xs ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderNickname}
                  className="w-6 h-6 rounded-full bg-slate-800 shrink-0 mt-0.5 border border-slate-700"
                />
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-semibold opacity-75 mb-0.5">
                    {msg.senderNickname}
                  </div>
                  <div className="break-words leading-relaxed">{msg.text}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Quick Picker */}
      <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleAddEmoji(emoji)}
            className="p-1 text-sm hover:scale-125 transition-transform"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message (max 500 chars)..."
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
