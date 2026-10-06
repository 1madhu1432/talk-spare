import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Users, Zap, Shield, Sparkles, MessageCircle, ArrowRight, Play, CheckCircle2, Radio, Lock } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  const { rooms } = useSocket();
  const activeRoomsCount = rooms.length;
  const activeUsersCount = rooms.reduce((sum, r) => sum + r.users.length, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-xl">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>100% Anonymous • No Account Required</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-white">
            Speak. Connect.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Learn.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Practice languages with real people from around the world through instant, temporary WebRTC voice rooms.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/setup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all flex items-center justify-center gap-3 group"
            >
              Start Talking Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/rooms"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card hover:bg-slate-800/80 text-slate-200 font-bold text-base border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <Radio className="w-5 h-5 text-emerald-400" />
              Explore Live Rooms ({activeRoomsCount})
            </Link>
          </div>

          {/* Live Platform Stats Card */}
          <div className="pt-12 max-w-3xl mx-auto grid grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
                {activeUsersCount + 42}+
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-1">Live Talkers</div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                14+
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-1">Global Languages</div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">
                0s
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-1">Registration Wait</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Simple 3-Step Process</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How TalkSphere Works</h3>
            <p className="text-sm text-slate-400 mt-3">Start speaking a new language in under 10 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl border border-slate-800 relative group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xl mb-6">
                1
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Choose Your Language</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your target language (English, Telugu, Hindi, Spanish, French, etc.) and speaking proficiency level.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-800 relative group">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black text-xl mb-6">
                2
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Join or Create a Room</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse existing temporary conversation rooms or launch your own public or private practice group instantly.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-800 relative group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl mb-6">
                3
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Start Real Voice Talking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect using browser peer-to-peer WebRTC audio. Mute, unmute, practice, and connect without database tracks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why TalkSphere Feature Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Built for Pure Fluency</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Why TalkSphere?</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6 text-amber-400" />,
              title: 'No Registration Required',
              desc: 'Jump directly into speaking sessions without email, passwords, or personal account setup.',
            },
            {
              icon: <Lock className="w-6 h-6 text-emerald-400" />,
              title: 'Zero Permanent Storage',
              desc: 'No database is used. When rooms empty or server restarts, all temporary data disappears completely.',
            },
            {
              icon: <Globe className="w-6 h-6 text-indigo-400" />,
              title: 'Global Community',
              desc: 'Practice with native speakers and fellow language enthusiasts from all time zones.',
            },
            {
              icon: <MessageCircle className="w-6 h-6 text-purple-400" />,
              title: 'Temporary Live Chat',
              desc: 'Send quick text, translations, and emojis in room chat that disappear when the room closes.',
            },
            {
              icon: <Shield className="w-6 h-6 text-rose-400" />,
              title: 'Live Moderation',
              desc: 'Real-time admin controls to kick or mute disruptive sockets immediately.',
            },
            {
              icon: <Users className="w-6 h-6 text-cyan-400" />,
              title: 'Quick Matchmaking',
              desc: 'Use Quick Talk to find an available 1-on-1 language practice partner in seconds.',
            },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="p-3 rounded-xl bg-slate-900 w-fit mb-4 border border-slate-800">{item.icon}</div>
              <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="glass-panel p-10 sm:p-12 rounded-3xl border border-indigo-500/30 text-center relative overflow-hidden bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready for your first conversation?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
            Select your language preference and enter a live audio room right now.
          </p>
          <Link
            to="/setup"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            Start Talking Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
