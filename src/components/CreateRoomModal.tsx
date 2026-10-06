import React, { useState } from 'react';
import { X, Sparkles, Lock, Unlock, Users, Mic, Video, ShieldCheck } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  'English', 'Telugu', 'Hindi', 'Spanish', 'French', 'German', 
  'Italian', 'Portuguese', 'Arabic', 'Japanese', 'Korean', 'Chinese', 'Russian', 'Other'
];

const LEVELS = [
  'Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Fluent'
];

const TOPICS = [
  'Casual Talk', 'Language Practice', 'Interview Practice', 'Travel', 'Business', 'Education', 'Friendship', 'Other'
];

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const { createRoom } = useSocket();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('Intermediate');
  const [topic, setTopic] = useState('Casual Talk');
  const [maxUsers, setMaxUsers] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'voice' | 'video'>('voice');
  const [allowAnyone, setAllowAnyone] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const roomName = name.trim() || `${language} ${topic}`;

    if (isPrivate && !password.trim()) {
      showToast('Please enter a password for your private room.', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      const room = await createRoom({
        name: roomName,
        language,
        level,
        topic,
        maxUsers,
        isPrivate,
        password: isPrivate ? password.trim() : undefined,
        mode,
        allowAnyone,
      });

      showToast('Temporary room created successfully!', 'success');
      onClose();
      navigate(`/room/${room.id}`);
    } catch (err: any) {
      // Toast already shown in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700/60 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Create Temporary Room</h2>
            <p className="text-xs text-slate-400">All room data exists only in server memory while active.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Room Name
            </label>
            <input
              type="text"
              placeholder="e.g. English Conversation & Coffee Talk"
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Language & Level Select */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
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
                Target Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic & Max Users */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Topic / Goal
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {TOPICS.map((top) => (
                  <option key={top} value={top}>
                    {top}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Participants
              </label>
              <select
                value={maxUsers}
                onChange={(e) => setMaxUsers(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {[2, 4, 6, 8, 10, 20].map((num) => (
                  <option key={num} value={num}>
                    {num} users
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Voice Mode Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Communication Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('voice')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  mode === 'voice'
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4 text-emerald-400" />
                Voice Only
              </button>
              <button
                type="button"
                onClick={() => setMode('video')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  mode === 'video'
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 text-indigo-400" />
                Voice + Video
              </button>
            </div>
          </div>

          {/* Privacy Toggle & Password */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPrivate ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
                <span className="text-xs font-semibold text-slate-200">
                  {isPrivate ? 'Private Room (Password Required)' : 'Public Room'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className="text-xs font-semibold text-indigo-400 hover:underline"
              >
                Switch to {isPrivate ? 'Public' : 'Private'}
              </button>
            </div>

            {isPrivate && (
              <input
                type="password"
                placeholder="Enter room password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            )}

            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={allowAnyone}
                onChange={(e) => setAllowAnyone(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
              />
              <span>Allow anyone matching language level to join</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
