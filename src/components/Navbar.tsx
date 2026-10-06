import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Users, Shield, Sparkles, User, Settings, LogOut, Radio } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useSocket } from '../contexts/SocketContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { profile } = useUser();
  const { isConnected, rooms, currentRoom, leaveRoom } = useSocket();

  const totalUsersInRooms = rooms.reduce((sum, r) => sum + r.users.length, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TalkSphere
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-medium tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Platform
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive('/')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </Link>
          <Link
            to="/rooms"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              isActive('/rooms')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            Rooms
            {rooms.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-semibold">
                {rooms.length}
              </span>
            )}
          </Link>
          <Link
            to="/how-it-works"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive('/how-it-works')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            How It Works
          </Link>
        </nav>

        {/* Right Section: Profile & Status */}
        <div className="flex items-center gap-3">
          {/* Online Indicator Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-slate-300 font-medium">
              {isConnected ? `${totalUsersInRooms + 1} Online` : 'Connecting...'}
            </span>
          </div>

          {/* User Profile Card */}
          <Link
            to="/setup"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all text-left"
          >
            <img
              src={profile.avatar}
              alt={profile.nickname}
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">
                {profile.nickname}
              </div>
              <div className="text-[10px] text-indigo-400 font-medium">
                {profile.language} • {profile.level}
              </div>
            </div>
            <Settings className="w-4 h-4 text-slate-400 hover:text-indigo-400 transition-colors hidden sm:block" />
          </Link>

          {/* Leave Room Button if inside a room */}
          {currentRoom && (
            <button
              onClick={leaveRoom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
