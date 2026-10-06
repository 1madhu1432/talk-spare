import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, Cpu, LogOut, Radio, ArrowLeft } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';

export const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useSocket();
  const { showToast } = useToast();

  const handleAdminLogout = () => {
    sessionStorage.removeItem('talksphere_admin_pass');
    showToast('Admin session logged out', 'info');
    navigate('/');
  };

  const isAdminLoggedIn = !!sessionStorage.getItem('talksphere_admin_pass');

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-rose-500/30 bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Admin Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-white flex items-center gap-2">
              TalkSphere <span className="text-rose-400 font-mono text-xs px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30">MODERATOR PORTAL</span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <Cpu className="w-3 h-3 text-emerald-400" />
              Isolated Server In-Memory Management
            </div>
          </div>
        </div>

        {/* Right Section: Status & Exit/Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-slate-300 font-mono text-[11px]">
              {isConnected ? 'Socket Relay Active' : 'Disconnected'}
            </span>
          </div>

          <Link
            to="/rooms"
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            User Platform
          </Link>

          {isAdminLoggedIn && (
            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
