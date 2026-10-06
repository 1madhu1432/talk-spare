import React, { useEffect, useRef } from 'react';
import { User } from '../types';
import { Mic, MicOff, Video, Crown, Volume2 } from 'lucide-react';
import { SpeakingIndicator } from './SpeakingIndicator';

interface ParticipantCardProps {
  user: User;
  isLocalUser?: boolean;
  stream?: MediaStream | null;
  volumeLevel?: number;
  onOpenReport?: (user: User) => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  user,
  isLocalUser = false,
  stream,
  volumeLevel = 0,
  onOpenReport,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream && user.isVideoOn) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, user.isVideoOn]);

  const isSpeaking = user.isSpeaking || volumeLevel > 15;

  return (
    <div className={`relative group glass-card rounded-2xl p-4 flex flex-col items-center justify-between min-h-[210px] border transition-all duration-300 ${
      isSpeaking
        ? 'border-indigo-400 shadow-2xl shadow-indigo-500/40 bg-indigo-950/40 ring-2 ring-indigo-500/60 scale-[1.02]'
        : 'border-slate-800'
    }`}>
      {/* Top Badges */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          {user.isHost && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              Host
            </span>
          )}
          {isLocalUser && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
              You
            </span>
          )}
          {isSpeaking && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Speaking
            </span>
          )}
        </div>

        {!isLocalUser && onOpenReport && (
          <button
            onClick={() => onOpenReport(user)}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 text-[10px] font-semibold transition-all px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700"
          >
            Report
          </button>
        )}
      </div>

      {/* Main Avatar / Video Area */}
      <div className="my-auto flex flex-col items-center justify-center relative w-full py-2">
        {user.isVideoOn && stream ? (
          <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isLocalUser}
              className="w-full h-full object-cover"
            />
            {isSpeaking && (
              <div className="absolute top-2 right-2 p-1.5 rounded-full bg-indigo-600 shadow-md animate-bounce">
                <Volume2 className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            {/* Animated Blinking / Pulsing Speaking Ring */}
            <div
              className={`absolute -inset-3 rounded-full transition-all duration-300 ${
                isSpeaking
                  ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-pulse opacity-90 blur-md scale-110'
                  : 'opacity-0'
              }`}
            />
            <img
              src={user.avatar}
              alt={user.nickname}
              className={`w-20 h-20 rounded-full bg-slate-900 border-2 relative z-10 transition-all ${
                isSpeaking
                  ? 'border-indigo-300 scale-105 shadow-2xl shadow-indigo-500/50 ring-4 ring-indigo-500/40'
                  : 'border-slate-700'
              }`}
            />
          </div>
        )}

        {/* Audio Visualizer Wave */}
        {isSpeaking && !user.isVideoOn && (
          <div className="mt-3">
            <SpeakingIndicator isSpeaking={true} />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-slate-800/60 mt-1 z-10">
        <div className="truncate max-w-[130px]">
          <div className={`text-xs font-bold truncate transition-colors ${
            isSpeaking ? 'text-indigo-300 font-extrabold' : 'text-slate-100'
          }`}>
            {user.nickname}
          </div>
          <div className="text-[10px] text-slate-400 truncate">{user.level || 'Practicing'}</div>
        </div>

        {/* Mic / Connection Status */}
        <div className="flex items-center gap-1.5">
          {user.isMuted ? (
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20" title="Muted">
              <MicOff className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span
              className={`p-1.5 rounded-lg border transition-colors ${
                isSpeaking
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 shadow-md shadow-emerald-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={isSpeaking ? 'Speaking' : 'Active'}
            >
              <Mic className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
