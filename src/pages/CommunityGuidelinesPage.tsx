import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Shield, Heart, UserX, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CommunityGuidelinesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Community Guidelines</h1>
          <p className="text-xs text-slate-400">Rules for maintaining a respectful global learning environment</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 text-xs sm:text-sm text-slate-300">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Core Code of Conduct
            </h2>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-100">Be Respectful & Patient:</strong> Language learners are practicing skills outside their comfort zone. Be encouraging and helpful.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-100">Zero Harassment or Hate Speech:</strong> Discrimination based on race, ethnicity, nationality, gender, religion, or orientation is strictly prohibited.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-100">No Sexual or Explicit Content:</strong> TalkSphere is purely for language education and casual conversation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-100">No Spam or Commercial Promotion:</strong> Do not broadcast automated advertisements or unsolicited marketing.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserX className="w-4 h-4 text-amber-400" />
              Safety Tools Available
            </h2>
            <p className="text-xs text-slate-400">
              If you encounter an abusive user:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-300">
              <li>Mute the user's speaker audio locally inside the room.</li>
              <li>Use the <strong>Report Participant</strong> button to immediately alert active moderators.</li>
              <li>Leave the room or create a private room with password protection.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
