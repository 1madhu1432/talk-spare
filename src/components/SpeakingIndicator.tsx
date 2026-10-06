import React from 'react';

interface SpeakingIndicatorProps {
  isSpeaking: boolean;
}

export const SpeakingIndicator: React.FC<SpeakingIndicatorProps> = ({ isSpeaking }) => {
  if (!isSpeaking) return null;

  return (
    <div className="flex items-center gap-1 h-5 px-2 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40">
      <div className="w-1 bg-indigo-400 rounded-full animate-[speaking-wave_0.8s_ease-in-out_infinite]" />
      <div className="w-1 bg-indigo-400 rounded-full animate-[speaking-wave_0.8s_ease-in-out_0.2s_infinite]" />
      <div className="w-1 bg-indigo-400 rounded-full animate-[speaking-wave_0.8s_ease-in-out_0.4s_infinite]" />
      <div className="w-1 bg-indigo-400 rounded-full animate-[speaking-wave_0.8s_ease-in-out_0.1s_infinite]" />
      <span className="text-[10px] font-semibold text-indigo-300 ml-1 uppercase tracking-wider">Speaking</span>
    </div>
  );
};
