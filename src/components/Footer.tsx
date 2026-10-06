import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart, Shield, Lock, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">TalkSphere</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Anonymous real-time language practice platform connecting language learners across the globe using peer-to-peer WebRTC audio.
          </p>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            100% Temporary In-Memory State
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Browse Rooms
              </Link>
            </li>
            <li>
              <Link to="/setup" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Quick Setup
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="text-slate-400 hover:text-indigo-400 transition-colors">
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        {/* Governance & Safety */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Platform & Safety</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-indigo-400" />
                Privacy & Data Policy
              </Link>
            </li>
            <li>
              <Link to="/community-guidelines" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400" />
                Community Guidelines
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Moderator Access
              </Link>
            </li>
          </ul>
        </div>

        {/* System Architecture Notice */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-200 mb-2">Zero Database Architecture</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            TalkSphere does not use MongoDB, MySQL, PostgreSQL, or persistent storage. When the Node.js server restarts, all temporary rooms and users automatically clear.
          </p>
          <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>© 2026 TalkSphere</span>
            <span className="flex items-center gap-1 text-indigo-400">
              Made with <Heart className="w-3 h-3 fill-indigo-400" /> for learners
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
