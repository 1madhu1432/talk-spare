import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { Room } from '../types';
import { RoomCard } from '../components/RoomCard';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { QuickTalkModal } from '../components/QuickTalkModal';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Zap, RefreshCw, Lock, Radio } from 'lucide-react';

const LANGUAGES = [
  'All', 'English', 'Telugu', 'Hindi', 'Spanish', 'French', 'German', 
  'Italian', 'Portuguese', 'Arabic', 'Japanese', 'Korean', 'Chinese', 'Russian', 'Other'
];

const LEVELS = [
  'All', 'Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Fluent'
];

export const RoomsPage: React.FC = () => {
  const { rooms, joinRoom, refreshRooms } = useSocket();
  const { profile } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isQuickTalkOpen, setIsQuickTalkOpen] = useState(false);

  // Private room password state
  const [passwordTargetRoom, setPasswordTargetRoom] = useState<Room | null>(null);
  const [passwordInput, setPasswordInput] = useState('');

  // Filtering
  const filteredRooms = rooms.filter((room) => {
    const matchesLang = selectedLanguage === 'All' || room.language === selectedLanguage;
    const matchesLevel = selectedLevel === 'All' || room.level === selectedLevel;
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLang && matchesLevel && matchesSearch;
  });

  const handleJoinClick = (room: Room) => {
    if (room.isPrivate) {
      setPasswordTargetRoom(room);
      setPasswordInput('');
    } else {
      executeJoin(room.id);
    }
  };

  const executeJoin = async (roomId: string, password?: string) => {
    try {
      await joinRoom(roomId, password);
      showToast('Joined room successfully!', 'success');
      setPasswordTargetRoom(null);
      navigate(`/room/${roomId}`);
    } catch (err) {
      // Toast handles error message
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTargetRoom) return;
    executeJoin(passwordTargetRoom.id, passwordInput.trim());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Conversation Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Find Someone to Talk to</h1>
            <p className="text-xs text-slate-400 mt-1">
              Currently practicing as <span className="text-slate-200 font-bold">{profile.nickname}</span> ({profile.language})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsQuickTalkOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Zap className="w-4 h-4" />
              Quick Talk
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Room
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by room name or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={refreshRooms}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
              title="Refresh Room List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Room Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} onJoin={handleJoinClick} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Radio className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No active rooms found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              There are currently no live rooms matching your selected filters. Create the first room now!
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Room
            </button>
          </div>
        )}
      </main>

      {/* Private Room Password Modal */}
      {passwordTargetRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-6 border border-slate-700 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Protected Room</h3>
                <p className="text-xs text-slate-400">{passwordTargetRoom.name}</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Enter Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Room password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordTargetRoom(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
                >
                  Join Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateRoomModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <QuickTalkModal isOpen={isQuickTalkOpen} onClose={() => setIsQuickTalkOpen(false)} />

      <Footer />
    </div>
  );
};
