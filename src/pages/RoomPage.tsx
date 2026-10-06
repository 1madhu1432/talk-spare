import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useWebRTC } from '../contexts/WebRTCContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { User } from '../types';
import { ParticipantCard } from '../components/ParticipantCard';
import { VoiceControls } from '../components/VoiceControls';
import { ChatPanel } from '../components/ChatPanel';
import { ParticipantList } from '../components/ParticipantList';
import { ReportModal } from '../components/ReportModal';
import { Navbar } from '../components/Navbar';
import { Mic, ShieldAlert, ArrowLeft, Volume2, Users, Lock, Video } from 'lucide-react';

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const { currentRoom, peers, leaveRoom } = useSocket();
  const { profile } = useUser();
  const { showToast } = useToast();

  const {
    localStream,
    peerStreams,
    isMicMuted,
    hasMicPermission,
    localVolumeLevel,
    requestMicrophone,
    leaveRoomWebRTC,
  } = useWebRTC();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [reportTargetUser, setReportTargetUser] = useState<User | null>(null);

  // Auto request microphone permission when entering live room
  useEffect(() => {
    if (hasMicPermission === null) {
      requestMicrophone();
    }
  }, [hasMicPermission]);

  // Handle leave room cleanup
  useEffect(() => {
    return () => {
      leaveRoomWebRTC();
    };
  }, [leaveRoomWebRTC]);

  // If room is invalid or user left
  if (!currentRoom) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Room Not Found or Disconnected</h2>
          <p className="text-xs text-slate-400 max-w-sm">
            This temporary conversation room has ended or you were disconnected.
          </p>
          <button
            onClick={() => {
              leaveRoom();
              navigate('/rooms');
            }}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Rooms Discovery
          </button>
        </div>
      </div>
    );
  }

  // Construct local user view object
  const localUserObj: User = {
    id: 'local_user',
    socketId: 'local_user_socket',
    nickname: profile.nickname,
    language: profile.language,
    level: profile.level,
    goal: profile.goal,
    avatar: profile.avatar,
    isMuted: isMicMuted,
    isVideoOn: !!localStream?.getVideoTracks().some(t => t.enabled),
    isSpeaking: !isMicMuted && localVolumeLevel > 15,
    joinedAt: Date.now(),
    isHost: currentRoom.hostId === 'local_user_socket',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 pb-24">
      <Navbar />

      {/* Room Header Info */}
      <header className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                {currentRoom.language}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                {currentRoom.level}
              </span>
              {currentRoom.isPrivate && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-500/30">
                  <Lock className="w-3 h-3" />
                  Private
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              {currentRoom.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Topic: {currentRoom.topic}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-300">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>
                {peers.length + 1} / {currentRoom.maxUsers} Participants
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mic Permission Banner / Warning */}
      {hasMicPermission === false && (
        <div className="bg-rose-950/90 border-b border-rose-500/40 p-4 text-center">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-rose-200 text-xs font-medium">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <span>Microphone access is required to speak and participate in voice rooms.</span>
            </div>
            <button
              onClick={requestMicrophone}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Participant Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Local User Card */}
          <ParticipantCard
            user={localUserObj}
            isLocalUser={true}
            stream={localStream}
            volumeLevel={localVolumeLevel}
          />

          {/* Remote Peer Cards */}
          {peers.map((peer) => {
            const stream = peerStreams.get(peer.socketId);
            return (
              <ParticipantCard
                key={peer.socketId}
                user={peer}
                isLocalUser={false}
                stream={stream}
                onOpenReport={(u) => setReportTargetUser(u)}
              />
            );
          })}
        </div>
      </main>

      {/* Thumb-Friendly Voice Controls Toolbar */}
      <VoiceControls
        onToggleChat={() => {
          setIsChatOpen(!isChatOpen);
          setIsParticipantsOpen(false);
        }}
        onToggleParticipants={() => {
          setIsParticipantsOpen(!isParticipantsOpen);
          setIsChatOpen(false);
        }}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
      />

      {/* Drawers */}
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ParticipantList
        isOpen={isParticipantsOpen}
        onClose={() => setIsParticipantsOpen(false)}
        onOpenReport={(u) => setReportTargetUser(u)}
      />

      {/* Report Modal */}
      <ReportModal
        user={reportTargetUser}
        isOpen={!!reportTargetUser}
        onClose={() => setReportTargetUser(null)}
      />
    </div>
  );
};
