import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Globe, Mic, Lock, Zap, Shield, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">How TalkSphere Works</h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            A breakdown of real-time peer-to-peer WebRTC audio, temporary in-memory rooms, and anonymous session handling.
          </p>
        </div>

        <div className="space-y-8">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-indigo-400">
              <Mic className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">1. Direct WebRTC Audio Signaling</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When you join a room, TalkSphere uses Socket.IO only as a lightweight signaling channel to negotiate ICE candidates, offers, and answers. Once connected, audio streams travel directly from browser to browser using peer-to-peer WebRTC connections. Raw voice audio never passes through or gets saved on our Node.js server.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <Cpu className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">2. Zero Database Architecture</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              TalkSphere does NOT use MongoDB, PostgreSQL, MySQL, Firebase, or Supabase. All temporary room metadata and user socket presence exist exclusively in server memory using JavaScript `Map` and `Set` data structures.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300">
              When the server restarts: all rooms disappear, all users disappear, and all temporary chat messages disappear automatically.
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <Shield className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">3. Live Safety & Moderation</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You can mute speakers locally, block unwanted participants, or submit a report to live moderators. Active moderators can kick or temporarily ban abusive sockets in real time.
            </p>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30"
          >
            Start Your First Session
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
