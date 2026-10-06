import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useToast } from './ToastContext';

interface WebRTCContextType {
  localStream: MediaStream | null;
  peerStreams: Map<string, MediaStream>;
  isMicMuted: boolean;
  isVideoOn: boolean;
  isSpeakerMuted: boolean;
  hasMicPermission: boolean | null;
  localVolumeLevel: number;
  peerVolumeLevels: Map<string, number>;
  connectionState: 'idle' | 'requesting' | 'connected' | 'error';
  requestMicrophone: () => Promise<boolean>;
  toggleMic: () => void;
  toggleVideo: () => void;
  toggleSpeaker: () => void;
  leaveRoomWebRTC: () => void;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket, currentRoom, peers, stunServer, turnServer, toggleMuteSocket, toggleVideoSocket, sendSpeakingSocket } = useSocket();
  const { showToast } = useToast();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerStreams, setPeerStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [localVolumeLevel, setLocalVolumeLevel] = useState<number>(0);
  const [peerVolumeLevels, setPeerVolumeLevels] = useState<Map<string, number>>(new Map());
  const [connectionState, setConnectionState] = useState<'idle' | 'requesting' | 'connected' | 'error'>('idle');

  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);
  const localAnalyserRef = useRef<AnalyserNode | null>(null);
  const localSpeakingTimer = useRef<NodeJS.Timeout | null>(null);

  const getIceServers = useCallback(() => {
    const servers: RTCIceServer[] = [{ urls: stunServer || 'stun:stun.l.google.com:19020' }];
    if (turnServer) {
      servers.push({
        urls: turnServer,
      });
    }
    return servers;
  }, [stunServer, turnServer]);

  const createSyntheticStream = (): MediaStream => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.0001; // Silent tone placeholder for WebRTC peer audio negotiation
      osc.connect(gain);
      const dst = ctx.createMediaStreamDestination();
      gain.connect(dst);
      osc.start();
      return dst.stream;
    } catch (e) {
      return new MediaStream();
    }
  };

  // Request media permission
  const requestMicrophone = async (): Promise<boolean> => {
    try {
      setConnectionState('requesting');
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });
        setHasMicPermission(true);
      } catch (e) {
        console.warn('Microphone access denied or unavailable, utilizing synthetic audio fallback:', e);
        stream = createSyntheticStream();
        setHasMicPermission(false);
      }

      setLocalStream(stream);
      setConnectionState('connected');

      // Setup audio analyzer for speaking detection
      setupAudioAnalyzer(stream);

      return true;
    } catch (err: any) {
      console.error('Microphone initialization error:', err);
      setConnectionState('error');
      return false;
    }
  };

  // Setup Web Audio API volume detection
  const setupAudioAnalyzer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      localAnalyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let isSpeakingCurrent = false;

      const checkVolume = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));

        setLocalVolumeLevel(normalized);

        const speakingThreshold = 15;
        if (normalized > speakingThreshold && !isSpeakingCurrent) {
          isSpeakingCurrent = true;
          sendSpeakingSocket(true);
        } else if (normalized <= speakingThreshold && isSpeakingCurrent) {
          isSpeakingCurrent = false;
          sendSpeakingSocket(false);
        }

        if (localAnalyserRef.current) {
          requestAnimationFrame(checkVolume);
        }
      };

      checkVolume();
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    const newMutedState = !isMicMuted;
    setIsMicMuted(newMutedState);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !newMutedState;
      });
    }
    toggleMuteSocket(newMutedState);
    showToast(newMutedState ? 'Microphone muted' : 'Microphone active', 'info');
  };

  // Toggle Video
  const toggleVideo = async () => {
    if (!localStream) return;
    const newVideoState = !isVideoOn;

    if (newVideoState) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        localStream.addTrack(videoTrack);

        // Add track to existing peer connections
        peerConnections.current.forEach((pc) => {
          pc.addTrack(videoTrack, localStream);
        });

        setIsVideoOn(true);
        toggleVideoSocket(true);
      } catch (err) {
        showToast('Camera access denied or unavailable.', 'error');
      }
    } else {
      localStream.getVideoTracks().forEach((track) => {
        track.stop();
        localStream.removeTrack(track);
      });
      setIsVideoOn(false);
      toggleVideoSocket(false);
    }
  };

  // Toggle Speaker
  const toggleSpeaker = () => {
    const newSpeakerMuted = !isSpeakerMuted;
    setIsSpeakerMuted(newSpeakerMuted);
    audioElements.current.forEach((audio) => {
      audio.muted = newSpeakerMuted;
    });
    showToast(newSpeakerMuted ? 'All speakers muted' : 'Speakers enabled', 'info');
  };

  // Initialize peer connection for target socket ID
  const createPeerConnection = useCallback((targetSocketId: string): RTCPeerConnection => {
    if (peerConnections.current.has(targetSocketId)) {
      return peerConnections.current.get(targetSocketId)!;
    }

    const pc = new RTCPeerConnection({
      iceServers: getIceServers(),
    });

    // Add local tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('webrtc:ice-candidate', {
          targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;

      setPeerStreams((prev) => {
        const next = new Map(prev);
        next.set(targetSocketId, remoteStream);
        return next;
      });

      // Attach audio element
      let audioElement = audioElements.current.get(targetSocketId);
      if (!audioElement) {
        audioElement = document.createElement('audio');
        audioElement.autoplay = true;
        audioElement.muted = isSpeakerMuted;
        document.body.appendChild(audioElement);
        audioElements.current.set(targetSocketId, audioElement);
      }
      audioElement.srcObject = remoteStream;
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
        pc.restartIce();
      }
    };

    peerConnections.current.set(targetSocketId, pc);
    return pc;
  }, [localStream, socket, getIceServers, isSpeakerMuted]);

  // Signaling socket handlers
  useEffect(() => {
    if (!socket || !currentRoom) return;

    // Receive offer -> Send answer
    const handleOffer = async ({ senderSocketId, offer }: { senderSocketId: string; offer: any }) => {
      try {
        const pc = createPeerConnection(senderSocketId);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('webrtc:answer', {
          targetSocketId: senderSocketId,
          answer,
        });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    };

    // Receive answer
    const handleAnswer = async ({ senderSocketId, answer }: { senderSocketId: string; answer: any }) => {
      try {
        const pc = peerConnections.current.get(senderSocketId);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    };

    // Receive ICE candidate
    const handleCandidate = async ({ senderSocketId, candidate }: { senderSocketId: string; candidate: any }) => {
      try {
        const pc = peerConnections.current.get(senderSocketId);
        if (pc && candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    };

    // When a peer connects -> initiate offer
    const handlePeerConnected = async ({ socketId }: { socketId: string }) => {
      try {
        const pc = createPeerConnection(socketId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit('webrtc:offer', {
          targetSocketId: socketId,
          offer,
        });
      } catch (err) {
        console.error('Error creating offer for peer:', err);
      }
    };

    // When peer disconnects -> cleanup
    const handlePeerDisconnected = ({ socketId }: { socketId: string }) => {
      closePeer(socketId);
    };

    socket.on('webrtc:offer', handleOffer);
    socket.on('webrtc:answer', handleAnswer);
    socket.on('webrtc:ice-candidate', handleCandidate);
    socket.on('peer:connected', handlePeerConnected);
    socket.on('peer:disconnected', handlePeerDisconnected);

    return () => {
      socket.off('webrtc:offer', handleOffer);
      socket.off('webrtc:answer', handleAnswer);
      socket.off('webrtc:ice-candidate', handleCandidate);
      socket.off('peer:connected', handlePeerConnected);
      socket.off('peer:disconnected', handlePeerDisconnected);
    };
  }, [socket, currentRoom, createPeerConnection]);

  // Clean single peer
  const closePeer = (targetSocketId: string) => {
    const pc = peerConnections.current.get(targetSocketId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(targetSocketId);
    }

    const audioElement = audioElements.current.get(targetSocketId);
    if (audioElement) {
      audioElement.pause();
      audioElement.remove();
      audioElements.current.delete(targetSocketId);
    }

    setPeerStreams((prev) => {
      const next = new Map(prev);
      next.delete(targetSocketId);
      return next;
    });
  };

  // Leave room WebRTC cleanup
  const leaveRoomWebRTC = useCallback(() => {
    peerConnections.current.forEach((pc, id) => {
      pc.close();
    });
    peerConnections.current.clear();

    audioElements.current.forEach((audio) => {
      audio.pause();
      audio.remove();
    });
    audioElements.current.clear();

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    localAnalyserRef.current = null;

    setPeerStreams(new Map());
    setIsVideoOn(false);
    setIsMicMuted(false);
    setConnectionState('idle');
  }, [localStream]);

  return (
    <WebRTCContext.Provider
      value={{
        localStream,
        peerStreams,
        isMicMuted,
        isVideoOn,
        isSpeakerMuted,
        hasMicPermission,
        localVolumeLevel,
        peerVolumeLevels,
        connectionState,
        requestMicrophone,
        toggleMic,
        toggleVideo,
        toggleSpeaker,
        leaveRoomWebRTC,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};
