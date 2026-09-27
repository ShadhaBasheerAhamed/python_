import React from 'react';
import { Star, Award, ArrowRight, Sparkles } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export default function RewardModal({ levelId, stars, xpEarned, newBadges, onNextLevel, onViewMap, onContinue }) {
  const hasNext = levelId < 22;

  const handleNextLevel = () => {
    playSound('click');
    if (onNextLevel) onNextLevel();
    else if (onContinue) onContinue();
  };

  const handleViewMap = () => {
    playSound('click');
    if (onViewMap) onViewMap();
    else if (onContinue) onContinue();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-game">
      <div className="max-w-md w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden">
        
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
        <div className="flex items-center justify-center gap-2 py-1">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-9 h-9 transition-transform ${
                s <= stars
                  ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* XP Earned Card */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between">
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

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {hasNext ? (
            <button
              onClick={handleNextLevel}
              className="w-full btn-game-emerald py-3.5 px-6 text-sm flex items-center justify-center gap-2"
            >
              <span>NEXT LEVEL {levelId + 1} →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}

          <button
            onClick={handleViewMap}
            className={`w-full py-3 px-6 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              hasNext
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                : 'btn-game-emerald py-3.5 text-sm'
            }`}
          >
            <span>EXPLORE QUEST MAP 🗺️</span>
          </button>
        </div>

      </div>
    </div>
  );
}
