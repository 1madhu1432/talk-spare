import React from 'react';
import { X, ShieldAlert, Crown, Mic, MicOff, UserCheck } from 'lucide-react';
import { User } from '../types';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '../contexts/UserContext';

interface ParticipantListProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReport: (user: User) => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  isOpen,
  onClose,
  onOpenReport,
}) => {
  const { currentRoom, peers } = useSocket();
  const { profile } = useUser();

  if (!isOpen || !currentRoom) return null;

  const allUsersInRoom = currentRoom.users || [];

  return (
    <div className="fixed right-0 top-16 bottom-20 z-30 w-full sm:w-80 glass-panel border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Room Participants</h3>
          <p className="text-[10px] text-slate-400">
            {allUsersInRoom.length} / {currentRoom.maxUsers} Users Connected
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {allUsersInRoom.map((user) => {
          const isMe = user.nickname === profile.nickname;
          return (
            <div
              key={user.socketId || user.id}
              className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.nickname}
                  className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-100">{user.nickname}</span>
                    {user.isHost && <span title="Host"><Crown className="w-3.5 h-3.5 text-amber-400" /></span>}
                    {isMe && <span className="text-[10px] text-indigo-400 font-bold">(You)</span>}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {user.language || currentRoom.language} • {user.level || 'Practicing'}
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2">
                {user.isMuted ? (
                  <span title="Muted"><MicOff className="w-4 h-4 text-rose-400" /></span>
                ) : (
                  <span title="Active"><Mic className="w-4 h-4 text-emerald-400" /></span>
                )}

                {!isMe && (
                  <button
                    onClick={() => onOpenReport(user)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Report Participant"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
