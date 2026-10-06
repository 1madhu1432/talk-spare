import React from 'react';
import { Room } from '../types';
import { Users, Lock, Mic, Video, ArrowRight, ShieldAlert } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onJoin: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  const isFull = room.users.length >= room.maxUsers;
  const hostUser = room.users.find(u => u.isHost) || room.users[0];

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      English: 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30',
      Telugu: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
      Hindi: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
      Spanish: 'from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30',
      French: 'from-cyan-500/20 to-sky-500/20 text-cyan-300 border-cyan-500/30',
      German: 'from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30',
      Japanese: 'from-red-500/20 to-rose-500/20 text-red-300 border-red-500/30',
      Korean: 'from-sky-500/20 to-blue-500/20 text-sky-300 border-sky-500/30',
    };
    return colors[lang] || 'from-slate-500/20 to-slate-700/20 text-slate-300 border-slate-700';
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-r ${getLanguageColor(room.language)}`}>
            {room.language}
          </div>

          <div className="flex items-center gap-1.5">
            {room.isPrivate && (
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Private Password Protected">
                <Lock className="w-3.5 h-3.5" />
              </span>
            )}
            <span className="p-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60" title={room.mode === 'video' ? 'Voice + Video' : 'Voice Only'}>
              {room.mode === 'video' ? <Video className="w-3.5 h-3.5 text-indigo-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
            </span>
          </div>
        </div>

        {/* Room Title & Topic */}
        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
          {room.name}
        </h3>
        <p className="text-xs text-slate-400 mb-4 line-clamp-1 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] font-medium border border-slate-800">
            {room.level}
          </span>
          <span className="text-slate-500">•</span>
          <span>{room.topic}</span>
        </p>
      </div>

      {/* Footer Details & Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-2">
        {/* Host details */}
        <div className="flex items-center gap-2">
          {hostUser && (
            <img
              src={hostUser.avatar}
              alt={hostUser.nickname}
              className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700"
            />
          )}
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Host</div>
            <div className="text-xs font-semibold text-slate-200 truncate max-w-[90px]">
              {hostUser ? hostUser.nickname : 'Anonymous'}
            </div>
          </div>
        </div>

        {/* Users counter & Join Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-300 font-mono bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className={isFull ? 'text-amber-400 font-bold' : ''}>
              {room.users.length}/{room.maxUsers}
            </span>
          </div>

          <button
            onClick={() => onJoin(room)}
            disabled={isFull}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isFull
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 group-hover:scale-105'
            }`}
          >
            {isFull ? (
              'Full'
            ) : (
              <>
                Join
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
