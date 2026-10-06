import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';
import { AdminNavbar } from '../components/AdminNavbar';
import { Footer } from '../components/Footer';
import { Room, User, Report, AdminStats } from '../types';
import { Shield, Users, Radio, MessageSquare, Trash2, UserX, AlertTriangle, RefreshCw, Cpu } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { socket } = useSocket();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeRooms: 0,
    activeVoiceSessions: 0,
    messagesPerMin: 0,
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'rooms' | 'users' | 'reports'>('rooms');

  useEffect(() => {
    const adminPass = sessionStorage.getItem('talksphere_admin_pass');
    if (!adminPass || !socket) {
      navigate('/admin/login');
      return;
    }

    // Authenticate admin socket
    socket.emit('admin:auth', adminPass, (res: any) => {
      if (res.success) {
        setIsAuthenticated(true);
        setStats(res.stats);
        setRooms(res.rooms || []);
        setUsers(res.users || []);
        setReports(res.reports || []);
      } else {
        showToast('Admin session expired or invalid.', 'error');
        sessionStorage.removeItem('talksphere_admin_pass');
        navigate('/admin/login');
      }
    });

    const handleUpdate = (data: any) => {
      setStats(data.stats);
      setRooms(data.rooms);
      setUsers(data.users);
      setReports(data.reports);
    };

    const handleNewReport = (report: Report) => {
      setReports((prev) => [report, ...prev]);
      showToast(`New user report: ${report.reason}`, 'warning');
    };

    socket.on('admin:stats-update', handleUpdate);
    socket.on('admin:new-report', handleNewReport);

    return () => {
      socket.off('admin:stats-update', handleUpdate);
      socket.off('admin:new-report', handleNewReport);
    };
  }, [socket, navigate]);

  if (!isAuthenticated) return null;

  const handleKickUser = (targetSocketId: string) => {
    if (socket) {
      socket.emit('admin:kick-user', targetSocketId);
      showToast('User kicked from session', 'info');
    }
  };

  const handleBanUser = (targetSocketId: string) => {
    if (socket) {
      socket.emit('admin:ban-user', targetSocketId);
      showToast('User socket banned from server session', 'warning');
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    if (socket) {
      socket.emit('admin:delete-room', roomId);
      showToast('Room closed by admin', 'info');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AdminNavbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Live Admin Moderation</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Real-time server state (In-Memory Maps & Socket.IO)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 animate-pulse">
              ● Live WebSocket Active
            </span>
          </div>
        </div>

        {/* Live Admin Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Online Users</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats.totalUsers}</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Rooms</span>
              <Radio className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats.activeRooms}</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Voice Sessions</span>
              <Radio className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats.activeVoiceSessions}</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Messages / Min</span>
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats.messagesPerMin}</div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rooms'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Active Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Connected Sockets ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            User Reports ({reports.length})
          </button>
        </div>

        {/* Tab 1: Rooms Table */}
        {activeTab === 'rooms' && (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
                    <th className="p-4">Room Name</th>
                    <th className="p-4">Language / Level</th>
                    <th className="p-4">Occupants</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {rooms.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No active rooms operating right now.
                      </td>
                    </tr>
                  ) : (
                    rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-slate-100">{room.name}</td>
                        <td className="p-4 text-slate-300">
                          {room.language} • {room.level}
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          {room.users.length} / {room.maxUsers}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              room.isPrivate
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {room.isPrivate ? 'Private' : 'Public'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold inline-flex items-center gap-1 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Room
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Connected Sockets Table */}
        {activeTab === 'users' && (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
                    <th className="p-4">User</th>
                    <th className="p-4">Language / Level</th>
                    <th className="p-4">Socket ID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {users.map((user) => (
                    <tr key={user.socketId} className="hover:bg-slate-900/40">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.nickname}
                          className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700"
                        />
                        <span className="font-bold text-slate-100">{user.nickname}</span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {user.language} • {user.level}
                      </td>
                      <td className="p-4 font-mono text-slate-400 text-[11px]">{user.socketId}</td>
                      <td className="p-4">
                        {user.roomId ? (
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                            In Room
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                            Lobby
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleKickUser(user.socketId)}
                          className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all"
                        >
                          Kick
                        </button>
                        <button
                          onClick={() => handleBanUser(user.socketId)}
                          className="px-3 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-500 text-xs font-bold transition-all"
                        >
                          Ban Session
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Reports List */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 text-xs">
                No active reports filed.
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="glass-panel p-5 rounded-2xl border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-rose-300 uppercase">
                        Reason: {report.reason}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(report.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">
                    Reporter: <strong className="text-white">{report.reporterNickname}</strong> reported{' '}
                    <strong className="text-rose-400">{report.reportedNickname}</strong> in room{' '}
                    <span className="text-indigo-300">{report.roomName}</span>.
                  </div>

                  {report.description && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      "{report.description}"
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleKickUser(report.reportedUserId)}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold"
                    >
                      Kick User
                    </button>
                    <button
                      onClick={() => handleBanUser(report.reportedUserId)}
                      className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold"
                    >
                      Ban User
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
