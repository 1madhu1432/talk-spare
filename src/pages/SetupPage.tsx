import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { useUser } from '../contexts/UserContext';
import { useSocket } from '../contexts/SocketContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Sparkles, Dices, ArrowRight, ShieldCheck, User } from 'lucide-react';

const LANGUAGES = [
  'English', 'Telugu', 'Hindi', 'Spanish', 'French', 'German', 
  'Italian', 'Portuguese', 'Arabic', 'Japanese', 'Korean', 'Chinese', 'Russian', 'Other'
];

const LEVELS = [
  'Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Fluent'
];

const GOALS = [
  'Casual Talk', 'Language Practice', 'Interview Practice', 'Travel', 'Business', 'Education', 'Friendship', 'Other'
];

export const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, generateRandomProfile } = useUser();
  const { socket } = useSocket();

  const [nickname, setNickname] = useState(profile.nickname);
  const [language, setLanguage] = useState(profile.language);
  const [level, setLevel] = useState(profile.level);
  const [goal, setGoal] = useState(profile.goal);

  const handleRandomize = () => {
    const random = generateRandomProfile();
    setNickname(random.nickname);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNickname = nickname.trim() || `Talker_${Math.floor(1000 + Math.random() * 9000)}`;

    const newProfile: UserProfile = {
      nickname: finalNickname,
      language,
      level,
      goal,
      avatar: profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${finalNickname}`,
    };

    updateProfile(newProfile);

    // Update socket session state
    if (socket) {
      socket.emit('user:update-profile', newProfile);
    }

    navigate('/rooms');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-2">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Temporary User Setup</h1>
            <p className="text-xs text-slate-400">
              No registration or account creation required. Preferences exist in browser memory for this session.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            {/* Nickname Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Nickname (Optional)
                </label>
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Dices className="w-3.5 h-3.5" />
                  Randomize
                </button>
              </div>
              <input
                type="text"
                maxLength={30}
                placeholder="Enter a temporary nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
            </div>

            {/* Language Selection Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Primary Language to Practice
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                      language === lang
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Your Speaking Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                      level === lvl
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Conversation Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Safety & Memory Note */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Session settings exist only in browser memory. No permanent account is created.</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              Continue to Room Discovery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};
