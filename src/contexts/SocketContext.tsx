import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room, ChatMessage, User } from '../types';
import { useToast } from './ToastContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  rooms: Room[];
  currentRoom: Room | null;
  peers: User[];
  chatHistory: ChatMessage[];
  stunServer: string;
  turnServer: string;
  createRoom: (data: any) => Promise<Room>;
  joinRoom: (roomId: string, password?: string) => Promise<Room>;
  leaveRoom: () => void;
  sendChatMessage: (text: string) => void;
  toggleMuteSocket: (isMuted: boolean) => void;
  toggleVideoSocket: (isVideoOn: boolean) => void;
  sendSpeakingSocket: (isSpeaking: boolean) => void;
  submitReport: (reportedUserId: string, reason: string, description: string) => void;
  refreshRooms: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [peers, setPeers] = useState<User[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [stunServer, setStunServer] = useState<string>('stun:stun.l.google.com:19020');
  const [turnServer, setTurnServer] = useState<string>('');

  const { showToast } = useToast();

  useEffect(() => {
    // Explicitly target backend server URL on localhost, or window.location.origin in production
    const backendUrl =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:4000'
        : window.location.origin;

    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      newSocket.emit('rooms:get');
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        showToast('Server disconnected your session.', 'warning');
      } else {
        showToast('Connection lost. Reconnecting...', 'warning');
      }
    });

    newSocket.on('init:config', (config) => {
      if (config.stunServer) setStunServer(config.stunServer);
      if (config.turnServer) setTurnServer(config.turnServer);
    });

    newSocket.on('rooms:list', (roomList: Room[]) => {
      setRooms(roomList);
    });

    newSocket.on('room:updated', (updatedRoom: Room) => {
      setCurrentRoom(updatedRoom);
      setPeers(updatedRoom.users.filter((u) => u.socketId !== newSocket.id));
    });

    newSocket.on('peer:connected', ({ peer }: { peer: User }) => {
      setPeers((prev) => [...prev.filter((p) => p.socketId !== peer.socketId), peer]);
      showToast(`${peer.nickname} joined the room.`, 'info');
    });

    newSocket.on('peer:disconnected', ({ socketId }: { socketId: string }) => {
      setPeers((prev) => {
        const leavingPeer = prev.find((p) => p.socketId === socketId);
        if (leavingPeer) {
          showToast(`${leavingPeer.nickname} left the room.`, 'info');
        }
        return prev.filter((p) => p.socketId !== socketId);
      });
    });

    newSocket.on('peer:state-changed', ({ socketId, isMuted, isVideoOn }) => {
      setPeers((prev) =>
        prev.map((p) => {
          if (p.socketId === socketId) {
            return {
              ...p,
              ...(isMuted !== undefined && { isMuted }),
              ...(isVideoOn !== undefined && { isVideoOn }),
            };
          }
          return p;
        })
      );
    });

    newSocket.on('peer:speaking', ({ socketId, isSpeaking }) => {
      setPeers((prev) =>
        prev.map((p) => (p.socketId === socketId ? { ...p, isSpeaking } : p))
      );
    });

    newSocket.on('chat:message', (message: ChatMessage) => {
      setChatHistory((prev) => [...prev, message]);
    });

    newSocket.on('error:ratelimit', (msg: string) => {
      showToast(msg, 'warning');
    });

    newSocket.on('admin:kicked', (msg: string) => {
      showToast(msg, 'error');
      setCurrentRoom(null);
      setPeers([]);
    });

    newSocket.on('admin:banned', (msg: string) => {
      showToast(msg, 'error');
      setCurrentRoom(null);
      setPeers([]);
    });

    newSocket.on('room:closed', (msg: string) => {
      showToast(msg, 'warning');
      setCurrentRoom(null);
      setPeers([]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const refreshRooms = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('rooms:get');
    }
  }, [socket, isConnected]);

  const createRoom = (data: any): Promise<Room> => {
    return new Promise((resolve, reject) => {
      if (!socket || !isConnected) {
        showToast('Server connection unavailable.', 'error');
        return reject(new Error('Socket disconnected'));
      }

      socket.emit('room:create', data, (res: { success: boolean; room?: Room; error?: string }) => {
        if (res.success && res.room) {
          resolve(res.room);
        } else {
          showToast(res.error || 'Failed to create room', 'error');
          reject(new Error(res.error));
        }
      });
    });
  };

  const joinRoom = (roomId: string, password?: string): Promise<Room> => {
    return new Promise((resolve, reject) => {
      if (!socket || !isConnected) {
        showToast('Server connection unavailable.', 'error');
        return reject(new Error('Socket disconnected'));
      }

      socket.emit(
        'room:join',
        { roomId, password },
        (res: { success: boolean; room?: Room; error?: string }) => {
          if (res.success && res.room) {
            setCurrentRoom(res.room);
            setPeers(res.room.users.filter((u) => u.socketId !== socket.id));
            resolve(res.room);
          } else {
            showToast(res.error || 'Failed to join room', 'error');
            reject(new Error(res.error));
          }
        }
      );
    });
  };

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('room:leave');
    }
    setCurrentRoom(null);
    setPeers([]);
    setChatHistory([]);
  };

  const sendChatMessage = (text: string) => {
    if (socket && currentRoom && text.trim()) {
      socket.emit('chat:send', { text });
    }
  };

  const toggleMuteSocket = (isMuted: boolean) => {
    if (socket && currentRoom) {
      socket.emit('user:mute', isMuted);
    }
  };

  const toggleVideoSocket = (isVideoOn: boolean) => {
    if (socket && currentRoom) {
      socket.emit('user:video-toggle', isVideoOn);
    }
  };

  const sendSpeakingSocket = (isSpeaking: boolean) => {
    if (socket && currentRoom) {
      socket.emit('user:speaking', isSpeaking);
    }
  };

  const submitReport = (reportedUserId: string, reason: string, description: string) => {
    if (socket && currentRoom) {
      socket.emit('report:submit', { reportedUserId, reason, description });
      showToast('Report submitted. Modern moderators alerted.', 'success');
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        isConnecting,
        rooms,
        currentRoom,
        peers,
        chatHistory,
        stunServer,
        turnServer,
        createRoom,
        joinRoom,
        leaveRoom,
        sendChatMessage,
        toggleMuteSocket,
        toggleVideoSocket,
        sendSpeakingSocket,
        submitReport,
        refreshRooms,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
