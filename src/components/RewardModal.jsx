import React from 'react';
import { Star, Award, ArrowRight, Sparkles } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export default function RewardModal({ levelId, stars, xpEarned, newBadges, onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-md w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full filter blur-3xl pointer-events-none" />

        <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-5xl shadow-inner animate-bounce-short">
          🎉
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
            Level {levelId} Cleared!
          </span>
          <h2 className="text-3xl font-black text-white">
            🎉 LEVEL COMPLETE!
          </h2>
          <p className="text-xs text-slate-400">
            Great job! You mastered this Python topic!
          </p>
        </div>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-10 h-10 transition-transform ${
                s <= stars
                  ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* XP Earned Card */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">XP Gained</span>
          <span className="text-2xl font-black text-amber-400 flex items-center gap-1">
            ⚡ +{xpEarned} XP
          </span>
        </div>

        {/* New Badges Earned */}
        {newBadges && newBadges.length > 0 && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-3 text-xs text-indigo-300 space-y-1">
            <span className="font-bold flex items-center justify-center gap-1">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>NEW BADGE UNLOCKED!</span>
            </span>
            <div className="font-black text-white">{newBadges[0].badge_name}</div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={() => { playSound('click'); onContinue(); }}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 text-base transition transform active:scale-95"
        >
          <span>CONTINUE QUEST</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
