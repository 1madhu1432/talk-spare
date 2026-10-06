import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Lock, ShieldCheck, Database, EyeOff } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy & Data Policy</h1>
          <p className="text-xs text-slate-400">Clear transparency regarding temporary data handling</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              1. No Persistent Database
            </h2>
            <p>
              TalkSphere does not operate any database storage engine (such as MongoDB, PostgreSQL, MySQL, Firebase, or Supabase). No user accounts, passwords, or personal profiles are stored permanently on any server disk or cloud database.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-purple-400" />
              2. Temporary In-Memory State
            </h2>
            <p>
              Your chosen nickname, language level, active room status, and text chat messages exist ONLY in server RAM memory while the conversation room is active. When all participants leave a room or when the Node.js process restarts, all room data and messages are deleted permanently.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              3. WebRTC Peer-to-Peer Voice Audio
            </h2>
            <p>
              Voice streams are transmitted directly between participant browsers using WebRTC peer-to-peer technology. Raw audio is never recorded, processed, or saved on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Infrastructure & Network Notice</h2>
            <p>
              Standard network protocols and web hosting infrastructure (e.g. standard HTTP reverse proxies or WebSockets) may naturally observe transient IP addresses during active connections to perform network routing.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
