import React, { useState, useEffect } from 'react';
import { X, Zap, Loader2, Globe, Users, ArrowRight } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

interface QuickTalkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  'English', 'Telugu', 'Hindi', 'Spanish', 'French', 'German', 
  'Italian', 'Portuguese', 'Arabic', 'Japanese', 'Korean', 'Chinese', 'Russian', 'Other'
];

export const QuickTalkModal: React.FC<QuickTalkModalProps> = ({ isOpen, onClose }) => {
  const { socket } = useSocket();
  const { profile } = useUser();
  const navigate = useNavigate();

  const [language, setLanguage] = useState(profile.language || 'English');
  const [level, setLevel] = useState(profile.level || 'Intermediate');
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching) {
      interval = setInterval(() => {
        setSearchTime((prev) => prev + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  useEffect(() => {
    if (!socket) return;

    const handleMatched = ({ roomId }: { roomId: string }) => {
      setIsSearching(false);
      onClose();
      navigate(`/room/${roomId}`);
    };

    socket.on('quick-talk:matched', handleMatched);
    socket.on('quick-talk:cancelled', () => {
      setIsSearching(false);
    });

    return () => {
      socket.off('quick-talk:matched', handleMatched);
      socket.off('quick-talk:cancelled');
    };
  }, [socket, navigate, onClose]);

  if (!isOpen) return null;

  const handleStartSearching = () => {
    if (socket) {
      setIsSearching(true);
      socket.emit('quick-talk:join', { language, level });
    }
  };

  const handleCancelSearching = () => {
    if (socket) {
      socket.emit('quick-talk:cancel');
    }
    setIsSearching(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700/60 shadow-2xl relative">
        <button
          onClick={() => {
            if (isSearching) handleCancelSearching();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Quick Talk Matchmaking</h2>
            <p className="text-xs text-slate-400">Instant 1-on-1 random practice room</p>
          </div>
        </div>

        {isSearching ? (
          <div className="py-8 text-center space-y-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-indigo-600/20 border-2 border-indigo-500/40 animate-ping absolute" />
              <div className="w-20 h-20 rounded-full bg-slate-900 border border-indigo-500 flex items-center justify-center relative shadow-lg">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Looking for a speaking partner...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Language: <span className="text-indigo-300 font-semibold">{language}</span> • Time: {searchTime}s
              </p>
            </div>

            <button
              onClick={handleCancelSearching}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            >
              Cancel Matchmaking
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Level
              </label>
              <input
                type="text"
                disabled
                value={level}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-400"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartSearching}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                Find Someone
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
