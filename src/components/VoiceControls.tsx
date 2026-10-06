import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Video, VideoOff, MessageSquare, Users, LogOut } from 'lucide-react';
import { useWebRTC } from '../contexts/WebRTCContext';
import { useSocket } from '../contexts/SocketContext';

interface VoiceControlsProps {
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  unreadCount?: number;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onToggleChat,
  onToggleParticipants,
  isChatOpen,
  isParticipantsOpen,
  unreadCount = 0,
}) => {
  const { isMicMuted, isVideoOn, isSpeakerMuted, toggleMic, toggleVideo, toggleSpeaker } = useWebRTC();
  const { leaveRoom, peers } = useSocket();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto">
      <div className="glass-panel px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-2 sm:gap-4 backdrop-blur-xl">
        {/* Mic Toggle */}
        <button
          onClick={toggleMic}
          aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
          title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
          className={`p-3.5 sm:px-4 sm:py-3 rounded-xl flex items-center gap-2 font-bold text-xs transition-all shadow-md ${
            isMicMuted
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span className="hidden sm:inline">{isMicMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        {/* Speaker Toggle */}
        <button
          onClick={toggleSpeaker}
          aria-label={isSpeakerMuted ? 'Enable speaker' : 'Disable speaker'}
          title={isSpeakerMuted ? 'Enable speaker' : 'Disable speaker'}
          className={`p-3 rounded-xl transition-all border ${
            isSpeakerMuted
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={toggleVideo}
          aria-label={isVideoOn ? 'Turn camera off' : 'Turn camera on'}
          title={isVideoOn ? 'Turn camera off' : 'Turn camera on'}
          className={`p-3 rounded-xl transition-all border ${
            isVideoOn
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Chat Drawer Toggle */}
        <button
          onClick={onToggleChat}
          aria-label="Toggle chat panel"
          title="Toggle chat panel"
          className={`p-3 rounded-xl relative transition-all border ${
            isChatOpen
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Participants Drawer Toggle */}
        <button
          onClick={onToggleParticipants}
          aria-label="Toggle participants list"
          title="Toggle participants list"
          className={`p-3 rounded-xl relative transition-all border ${
            isParticipantsOpen
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
            {peers.length + 1}
          </span>
        </button>

        {/* Leave Room Button */}
        <button
          onClick={leaveRoom}
          aria-label="Leave room"
          title="Leave room"
          className="p-3 sm:px-4 sm:py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </div>
  );
};
